import { Test, TestingModule } from '@nestjs/testing';

import { PositionFactory } from '@module/position/entities/__spec__/position.factory';
import { PositionServiceModule } from '@module/position/services/position-service/position-service.module';
import {
  IPositionService,
  POSITION_SERVICE,
} from '@module/position/services/position-service/position.service.interface';
import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectRecruitmentPostCreationRestrictedError } from '@module/project/errors/project-recruitment-creation-restricted.error';
import { ProjectRecruitmentPostRepositoryModule } from '@module/project/repositories/project-recruitment-post.repository.module';
import {
  PROJECT_RECRUITMENT_POST_REPOSITORY,
  ProjectRecruitmentPostRepositoryPort,
} from '@module/project/repositories/project-recruitment-post.repository.port';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';
import { CreateProjectRecruitmentPostCommandFactory } from '@module/project/use-cases/create-project-recruitment-post/__spec__/create-project-recruitment-post-command.factory';
import { CreateProjectRecruitmentPostCommand } from '@module/project/use-cases/create-project-recruitment-post/create-project-recruitment-post.command';
import { CreateProjectRecruitmentPostHandler } from '@module/project/use-cases/create-project-recruitment-post/create-project-recruitment-post.handler';
import { TechStackFactory } from '@module/tech-stack/entities/__spec__/tech-stack.factory';
import { TechStackServiceModule } from '@module/tech-stack/services/tech-stack-service/tech-stack-service.module';
import {
  ITechStackService,
  TECH_STACK_SERVICE,
} from '@module/tech-stack/services/tech-stack-service/tech-stack.service.interface';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(CreateProjectRecruitmentPostHandler.name, () => {
  let handler: CreateProjectRecruitmentPostHandler;

  let projectRepository: ProjectRepositoryPort;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let projectRecruitmentPostRepository: ProjectRecruitmentPostRepositoryPort;
  let eventStore: IEventStore;
  let positionService: IPositionService;
  let techStackService: ITechStackService;

  let command: CreateProjectRecruitmentPostCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ProjectRepositoryModule,
        ProjectRecruitmentPostRepositoryModule,
        EventStoreModule,
        PositionServiceModule,
        TechStackServiceModule,
      ],
      providers: [CreateProjectRecruitmentPostHandler],
    }).compile();

    handler = module.get<CreateProjectRecruitmentPostHandler>(
      CreateProjectRecruitmentPostHandler,
    );

    projectRepository = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY);
    projectRecruitmentPostRepository =
      module.get<ProjectRecruitmentPostRepositoryPort>(
        PROJECT_RECRUITMENT_POST_REPOSITORY,
      );
    eventStore = module.get<IEventStore>(EVENT_STORE);
    positionService = module.get<IPositionService>(POSITION_SERVICE);
    techStackService = module.get<ITechStackService>(TECH_STACK_SERVICE);
  });

  beforeEach(() => {
    command = CreateProjectRecruitmentPostCommandFactory.build();

    jest.spyOn(eventStore, 'storeAggregateEvents');
    jest
      .spyOn(positionService, 'findByNamesOrFail')
      .mockResolvedValue([
        PositionFactory.build({ name: command.positionName }),
      ]);
    jest
      .spyOn(techStackService, 'findByIdsOrFail')
      .mockResolvedValue(
        command.techStackIds.map((techStackId) =>
          TechStackFactory.build({ id: techStackId }),
        ),
      );
  });

  describe('식별자와 일치하는 프로젝트가 존재하고', () => {
    describe('프로젝트 소유자가 게시글을 생성하는 경우', () => {
      beforeEach(async () => {
        await projectRepository.insert(
          ProjectFactory.build({
            id: command.projectId,
            ownerId: command.currentUserId,
          }),
        );
      });

      describe('게시글을 생성하면', () => {
        it('게시글이 생성된다.', async () => {
          await expect(handler.execute(command)).resolves.toEqual(
            expect.objectContaining({
              projectId: command.projectId,
              authorId: command.currentUserId,
              title: command.title,
              description: command.description,
              techStackNames: command.techStackIds,
            }),
          );
        });
      });
    });

    describe('프로젝트 소유자가 아닌 사람이 게시글을 생성하는 경우', () => {
      beforeEach(async () => {
        await projectRepository.insert(
          ProjectFactory.build({ id: command.projectId }),
        );
      });

      describe('게시글을 생성하면', () => {
        it('게시글을 생성할 권한이 없다는 에러가 발생해야한다.', async () => {
          await expect(handler.execute(command)).rejects.toThrow(
            ProjectRecruitmentPostCreationRestrictedError,
          );
        });
      });
    });
  });

  describe('식별자와 일치하는 프로젝트가 존재하지 않는 경우', () => {
    describe('게시글을 생성하면', () => {
      it('프로젝트가 존재하지 않는다는 에러가 발생해야한다.', async () => {
        await expect(handler.execute(command)).rejects.toThrow(
          ProjectNotFoundError,
        );
      });
    });
  });
});
