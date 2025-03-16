import { Test, TestingModule } from '@nestjs/testing';

import { PositionFactory } from '@module/position/entities/__spec__/position.factory';
import { PositionServiceModule } from '@module/position/services/position-service/position-service.module';
import {
  IPositionService,
  POSITION_SERVICE,
} from '@module/position/services/position-service/position.service.interface';
import { ProjectApplicationFactory } from '@module/project/entities/__spec__/project-application.factory';
import { ProjectMemberFactory } from '@module/project/entities/__spec__/project-member.factory';
import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import { ProjectApplicationStatus } from '@module/project/entities/project-application.entity';
import { ProjectApplicationCreationRestrictedError } from '@module/project/errors/project-application-creation-restricted.error';
import { ProjectMemberAlreadyExistsError } from '@module/project/errors/project-member-already-exists.error';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectApplicationRepositoryModule } from '@module/project/repositories/project-application.repository.module';
import {
  PROJECT_APPLICATION_REPOSITORY,
  ProjectApplicationRepositoryPort,
} from '@module/project/repositories/project-application.repository.port';
import { ProjectMemberRepositoryModule } from '@module/project/repositories/project-member.repository.module';
import {
  PROJECT_MEMBER_REPOSITORY,
  ProjectMemberRepositoryPort,
} from '@module/project/repositories/project-member.repository.port';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';
import { CreateProjectApplicationCommandFactory } from '@module/project/use-cases/create-project-application/__spec__/create-project-application-command.factory';
import { CreateProjectApplicationCommand } from '@module/project/use-cases/create-project-application/create-project-application.command';
import { CreateProjectApplicationHandler } from '@module/project/use-cases/create-project-application/create-project-application.handler';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(CreateProjectApplicationHandler.name, () => {
  let handler: CreateProjectApplicationHandler;

  let projectRepository: ProjectRepositoryPort;
  let projectMemberRepository: ProjectMemberRepositoryPort;
  let projectApplicationRepository: ProjectApplicationRepositoryPort;
  let positionService: IPositionService;
  let eventStore: IEventStore;

  let command: CreateProjectApplicationCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ProjectRepositoryModule,
        ProjectMemberRepositoryModule,
        ProjectApplicationRepositoryModule,
        EventStoreModule,
        PositionServiceModule,
      ],
      providers: [CreateProjectApplicationHandler],
    }).compile();

    handler = module.get<CreateProjectApplicationHandler>(
      CreateProjectApplicationHandler,
    );

    projectRepository = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY);
    projectMemberRepository = module.get<ProjectMemberRepositoryPort>(
      PROJECT_MEMBER_REPOSITORY,
    );
    projectApplicationRepository = module.get<ProjectApplicationRepositoryPort>(
      PROJECT_APPLICATION_REPOSITORY,
    );
    positionService = module.get<IPositionService>(POSITION_SERVICE);
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = CreateProjectApplicationCommandFactory.build();

    jest.spyOn(eventStore, 'storeAggregateEvents');
    jest
      .spyOn(positionService, 'findByIdsOrFail')
      .mockResolvedValue([PositionFactory.build({ id: command.positionId })]);
  });

  describe('식별자와 일치하는 프로젝트가 존재하고', () => {
    beforeEach(async () => {
      await projectRepository.insert(
        ProjectFactory.build({ id: command.projectId }),
      );
    });

    describe('지원자가 아직 구성원이 아니고', () => {
      describe('진행중인 지원서가 존재하지 않는 경우', () => {
        beforeEach(async () => {
          await projectApplicationRepository.insert(
            ProjectApplicationFactory.build({
              projectId: command.projectId,
              applicantId: command.applicantId,
              status: ProjectApplicationStatus.rejected,
            }),
          );
        });

        describe('프로젝트에 지원하면', () => {
          it('프로젝트에 지원된다.', async () => {
            await expect(handler.execute(command)).resolves.toEqual(
              expect.objectContaining({
                projectId: command.projectId,
                applicantId: command.applicantId,
                positionName: expect.any(String),
              }),
            );
          });
        });
      });

      describe('진행중인 지원서가 존재하는 경우', () => {
        beforeEach(async () => {
          await projectApplicationRepository.insert(
            ProjectApplicationFactory.build({
              projectId: command.projectId,
              applicantId: command.applicantId,
              status: ProjectApplicationStatus.pending,
            }),
          );
        });

        describe('프로젝트에 지원하면', () => {
          it('아직 진행중인 지원서가 존재한다는 에러가 발생해야한다.', async () => {
            await expect(handler.execute(command)).rejects.toThrow(
              ProjectApplicationCreationRestrictedError,
            );
          });
        });
      });
    });

    describe('지원자가 이미 구성원인 경우', () => {
      beforeEach(async () => {
        await projectMemberRepository.insert(
          ProjectMemberFactory.build({
            projectId: command.projectId,
            accountId: command.applicantId,
          }),
        );
      });

      describe('프로젝트에 지원하면', () => {
        it('이미 구성원이라는 에러가 발생한다.', async () => {
          await expect(handler.execute(command)).rejects.toThrow(
            ProjectMemberAlreadyExistsError,
          );
        });
      });
    });
  });

  describe('식별자와 일치하는 프로젝트가 존재하지 않는 경우', () => {
    describe('프로젝트에 지원하면', () => {
      it('프로젝트가 존재하지 않는다는 에러가 발생한다.', async () => {
        await expect(handler.execute(command)).rejects.toThrow(
          ProjectNotFoundError,
        );
      });
    });
  });
});
