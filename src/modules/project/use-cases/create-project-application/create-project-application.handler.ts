import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  IPositionService,
  POSITION_SERVICE,
} from '@module/position/services/position-service/position.service.interface';
import { ProjectApplication } from '@module/project/entities/project-application.entity';
import { ProjectMemberAlreadyExistsError } from '@module/project/errors/project-member-already-exists.error';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import {
  PROJECT_APPLICATION_REPOSITORY,
  ProjectApplicationRepositoryPort,
} from '@module/project/repositories/project-application.repository.port';
import {
  PROJECT_MEMBER_REPOSITORY,
  ProjectMemberRepositoryPort,
} from '@module/project/repositories/project-member.repository.port';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';
import { CreateProjectApplicationCommand } from '@module/project/use-cases/create-project-application/create-project-application.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(CreateProjectApplicationCommand)
export class CreateProjectApplicationHandler
  implements
    ICommandHandler<CreateProjectApplicationCommand, ProjectApplication>
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositoryPort,
    @Inject(PROJECT_MEMBER_REPOSITORY)
    private readonly projectMemberRepository: ProjectMemberRepositoryPort,
    @Inject(PROJECT_APPLICATION_REPOSITORY)
    private readonly projectApplicationRepository: ProjectApplicationRepositoryPort,
    @Inject(POSITION_SERVICE)
    private readonly positionService: IPositionService,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  async execute(
    command: CreateProjectApplicationCommand,
  ): Promise<ProjectApplication> {
    const [project, projectMember] = await Promise.all([
      this.projectRepository.findOneById(command.projectId),
      this.projectMemberRepository.findOneByAccountInProject(
        command.projectId,
        command.applicantId,
      ),
    ]);

    if (project === undefined) {
      throw new ProjectNotFoundError();
    }

    if (projectMember !== undefined) {
      throw new ProjectMemberAlreadyExistsError();
    }

    const [position] = await this.positionService.findByNamesOrFail([
      command.positionName,
    ]);

    project.applications =
      await this.projectApplicationRepository.findByProjectApplicant(
        command.projectId,
        command.applicantId,
      );

    const projectApplication = project.createApplication({
      applicantId: command.applicantId,
      positionName: position.name,
    });

    await this.projectApplicationRepository.insert(projectApplication);

    await this.eventStore.storeAggregateEvents(project);

    return projectApplication;
  }
}
