import { Test, TestingModule } from '@nestjs/testing';

import { ProjectApplicationFactory } from '@module/project/entities/__spec__/project-application.factory';
import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import {
  ProjectApplication,
  ProjectApplicationStatus,
} from '@module/project/entities/project-application.entity';
import { Project } from '@module/project/entities/project.entity';
import { ProjectApplicationChangeStatusRestrictedError } from '@module/project/errors/project-application-change-status-restricted.error';
import { ProjectApplicationNotFoundError } from '@module/project/errors/project-application-not-found.error';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectApplicationRepositoryModule } from '@module/project/repositories/project-application.repository.module';
import {
  PROJECT_APPLICATION_REPOSITORY,
  ProjectApplicationRepositoryPort,
} from '@module/project/repositories/project-application.repository.port';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';
import { CancelProjectApplicationCommandFactory } from '@module/project/use-cases/cancel-project-application/__spec__/cancel-project-application-command.factory';
import { CancelProjectApplicationCommand } from '@module/project/use-cases/cancel-project-application/cancel-project-application.command';
import { CancelProjectApplicationHandler } from '@module/project/use-cases/cancel-project-application/cancel-project-application.handler';

import { generateEntityId } from '@common/base/base.entity';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(CancelProjectApplicationHandler.name, () => {
  let handler: CancelProjectApplicationHandler;

  let projectRepository: ProjectRepositoryPort;
  let projectApplicationRepository: ProjectApplicationRepositoryPort;
  let eventStore: IEventStore;

  let command: CancelProjectApplicationCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ProjectRepositoryModule,
        ProjectApplicationRepositoryModule,
        EventStoreModule,
      ],
      providers: [CancelProjectApplicationHandler],
    }).compile();

    handler = module.get<CancelProjectApplicationHandler>(
      CancelProjectApplicationHandler,
    );

    projectRepository = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY);
    projectApplicationRepository = module.get<ProjectApplicationRepositoryPort>(
      PROJECT_APPLICATION_REPOSITORY,
    );
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = CancelProjectApplicationCommandFactory.build();

    jest.spyOn(eventStore, 'storeAggregateEvents');
  });

  describe('식별자와 일치하는 프로젝트가 존재하고', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let project: Project;

    beforeEach(async () => {
      project = await projectRepository.insert(
        ProjectFactory.build({
          id: command.projectId,
        }),
      );
    });

    describe('식별자와 일치하는 지원서가 존재하고', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let application: ProjectApplication;

      beforeEach(async () => {
        application = await projectApplicationRepository.insert(
          ProjectApplicationFactory.build({
            id: command.applicationId,
            projectId: command.projectId,
            applicantId: command.currentUserId,
            status: ProjectApplicationStatus.checked,
          }),
        );
      });

      describe('지원자 본인이 취소하는 경우', () => {
        describe('지원서를 취소하면', () => {
          it('지원서가 취소돼야한다.', async () => {
            await expect(handler.execute(command)).resolves.toEqual(
              expect.objectContaining({
                status: ProjectApplicationStatus.canceled,
              }),
            );
            expect(eventStore.storeAggregateEvents).toHaveBeenCalled();
          });
        });
      });

      describe('지원자가 아닌 사람이 취소하려는 경우', () => {
        describe('지원서를 취소하면', () => {
          it('프로젝틑 소유자만 지원서를 취소할 수 있다는 에러가 발생해야한다.', async () => {
            await expect(
              handler.execute({
                ...command,
                currentUserId: generateEntityId(),
              }),
            ).rejects.toThrow(ProjectApplicationChangeStatusRestrictedError);
          });
        });
      });
    });

    describe('식별자와 일치하는 지원서가 존재하지 않는 경우', () => {
      describe('지원서를 취소하면', () => {
        it('지원서가 존재하지 않는다는 에러가 발생해야한다.', async () => {
          await expect(handler.execute(command)).rejects.toThrow(
            ProjectApplicationNotFoundError,
          );
        });
      });
    });
  });

  describe('식별자와 일치하는 프로젝트가 존재하지 않는 경우', () => {
    describe('지원서 상태를 변경하면', () => {
      it('프로젝트가 존재하지 않는다는 에러가 발생해야한다.', async () => {
        await expect(handler.execute(command)).rejects.toThrow(
          ProjectNotFoundError,
        );
      });
    });
  });
});
