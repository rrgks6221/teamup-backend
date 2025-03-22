import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  IPositionService,
  POSITION_SERVICE,
} from '@module/position/services/position-service/position.service.interface';
import { ProjectRecruitmentPost } from '@module/project/entities/project-recruitment-post.entity';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectRecruitmentPostCreationRestrictedError } from '@module/project/errors/project-recruitment-creation-restricted.error';
import {
  PROJECT_RECRUITMENT_POST_REPOSITORY,
  ProjectRecruitmentPostRepositoryPort,
} from '@module/project/repositories/project-recruitment-post.repository.port';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';
import { CreateProjectRecruitmentPostCommand } from '@module/project/use-cases/create-project-recruitment-post/create-project-recruitment-post.command';
import {
  ITechStackService,
  TECH_STACK_SERVICE,
} from '@module/tech-stack/services/tech-stack-service/tech-stack.service.interface';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(CreateProjectRecruitmentPostCommand)
export class CreateProjectRecruitmentPostHandler
  implements
    ICommandHandler<
      CreateProjectRecruitmentPostCommand,
      ProjectRecruitmentPost
    >
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositoryPort,
    @Inject(PROJECT_RECRUITMENT_POST_REPOSITORY)
    private readonly projectRecruitmentPostRepository: ProjectRecruitmentPostRepositoryPort,
    @Inject(POSITION_SERVICE)
    private readonly positionService: IPositionService,
    @Inject(TECH_STACK_SERVICE)
    private readonly techStackService: ITechStackService,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  async execute(
    command: CreateProjectRecruitmentPostCommand,
  ): Promise<ProjectRecruitmentPost> {
    const project = await this.projectRepository.findOneById(command.projectId);

    if (project === undefined) {
      throw new ProjectNotFoundError();
    }

    if (project.ownerId !== command.currentUserId) {
      throw new ProjectRecruitmentPostCreationRestrictedError(
        'Only project owner can create recruitment post',
      );
    }

    const [positions, techStacks] = await Promise.all([
      this.positionService.findByNamesOrFail([command.positionName]),
      this.techStackService.findByIdsOrFail(command.techStackIds),
    ]);

    const projectRecruitmentPost = project.createRecruitmentPost({
      projectId: command.projectId,
      authorId: command.currentUserId,
      title: command.title,
      description: command.description,
      positionName: positions[0].name,
      techStackNames: techStacks.map((techStack) => techStack.name),
    });

    await this.projectRecruitmentPostRepository.insert(projectRecruitmentPost);

    await this.eventStore.storeAggregateEvents(project);

    return projectRecruitmentPost;
  }
}
