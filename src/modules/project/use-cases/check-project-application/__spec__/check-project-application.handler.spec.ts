import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { ProjectApplicationFactory } from '@module/project/entities/__spec__/project-application.factory';
import { ProjectMemberFactory } from '@module/project/entities/__spec__/project-member.factory';
import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import {
  ProjectApplication,
  ProjectApplicationStatus,
} from '@module/project/entities/project-application.entity';
import { ProjectMemberRole } from '@module/project/entities/project-member.entity';
import { Project } from '@module/project/entities/project.entity';
import { ProjectApplicationChangeStatusRestrictedError } from '@module/project/errors/project-application-change-status-restricted.error';
import { ProjectApplicationNotFoundError } from '@module/project/errors/project-application-not-found.error';
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
import { CheckProjectApplicationCommandFactory } from '@module/project/use-cases/check-project-application/__spec__/check-project-application-command.factory';
import { CheckProjectApplicationCommand } from '@module/project/use-cases/check-project-application/check-project-application.command';
import { CheckProjectApplicationHandler } from '@module/project/use-cases/check-project-application/check-project-application.handler';

import { generateEntityId } from '@common/base/base.entity';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(CheckProjectApplicationHandler.name, () => {
  let handler: CheckProjectApplicationHandler;

  let projectRepository: ProjectRepositoryPort;
  let projectMemberRepository: ProjectMemberRepositoryPort;
  let projectApplicationRepository: ProjectApplicationRepositoryPort;
  let eventStore: IEventStore;

  let command: CheckProjectApplicationCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ProjectRepositoryModule,
        ProjectMemberRepositoryModule,
        ProjectApplicationRepositoryModule,
        EventStoreModule,
      ],
      providers: [CheckProjectApplicationHandler],
    }).compile();

    handler = module.get<CheckProjectApplicationHandler>(
      CheckProjectApplicationHandler,
    );

    projectRepository = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY);
    projectMemberRepository = module.get<ProjectMemberRepositoryPort>(
      PROJECT_MEMBER_REPOSITORY,
    );
    projectApplicationRepository = module.get<ProjectApplicationRepositoryPort>(
      PROJECT_APPLICATION_REPOSITORY,
    );
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = CheckProjectApplicationCommandFactory.build();

    jest.spyOn(eventStore, 'storeAggregateEvents');
  });

  describe('식별자와 일치하는 프로젝트가 존재하고', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let project: Project;

    beforeEach(async () => {
      project = await projectRepository.insert(
        ProjectFactory.build({
          id: command.projectId,
          ownerId: command.currentUserId,
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
            status: ProjectApplicationStatus.pending,
          }),
        );
      });

      describe('프로젝트 관리자가 체크하는 경우', () => {
        beforeEach(async () => {
          await projectMemberRepository.insert(
            ProjectMemberFactory.build({
              projectId: command.projectId,
              accountId: command.currentUserId,
              role: faker.helpers.arrayElement([
                ProjectMemberRole.owner,
                ProjectMemberRole.admin,
              ]),
            }),
          );
        });

        describe('지원서를 체크하면', () => {
          it('지원서가 체크돼야한다.', async () => {
            await expect(handler.execute(command)).resolves.toEqual(
              expect.objectContaining({
                status: ProjectApplicationStatus.checked,
              }),
            );
            expect(eventStore.storeAggregateEvents).toHaveBeenCalled();
          });
        });
      });

      describe('프로젝트 관리자가 아닌 사람이 체크하려는 경우', () => {
        beforeEach(async () => {
          await projectMemberRepository.insert(
            ProjectMemberFactory.build({
              projectId: command.projectId,
              accountId: command.currentUserId,
              role: faker.helpers.arrayElement([ProjectMemberRole.member]),
            }),
          );
        });

        describe('지원서를 체크하면', () => {
          it('프로젝틑 관리자만 지원서를 체크할 수 있다는 에러가 발생해야한다.', async () => {
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
      describe('지원서를 체크하면', () => {
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
