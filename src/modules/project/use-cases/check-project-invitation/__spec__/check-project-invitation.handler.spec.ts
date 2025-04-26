import { Test, TestingModule } from '@nestjs/testing';

import { ProjectInvitationFactory } from '@module/project/entities/__spec__/project-invitation.factory';
import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import {
  ProjectInvitation,
  ProjectInvitationStatus,
} from '@module/project/entities/project-invitation.entity';
import { Project } from '@module/project/entities/project.entity';
import { ProjectInvitationChangeStatusRestrictedError } from '@module/project/errors/project-invitation-change-status-restricted.error';
import { ProjectInvitationNotFoundError } from '@module/project/errors/project-invitation-not-found.error';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectInvitationRepositoryModule } from '@module/project/repositories/project-invitation.repository.module';
import {
  PROJECT_INVITATION_REPOSITORY,
  ProjectInvitationRepositoryPort,
} from '@module/project/repositories/project-invitation.repository.port';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';
import { CheckProjectInvitationCommandFactory } from '@module/project/use-cases/check-project-invitation/__spec__/check-project-invitation-command.factory';
import { CheckProjectInvitationCommand } from '@module/project/use-cases/check-project-invitation/check-project-invitation.command';
import { CheckProjectInvitationHandler } from '@module/project/use-cases/check-project-invitation/check-project-invitation.handler';

import { generateEntityId } from '@common/base/base.entity';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(CheckProjectInvitationHandler.name, () => {
  let handler: CheckProjectInvitationHandler;

  let projectRepository: ProjectRepositoryPort;
  let projectInvitationRepository: ProjectInvitationRepositoryPort;
  let eventStore: IEventStore;

  let command: CheckProjectInvitationCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ProjectRepositoryModule,
        ProjectInvitationRepositoryModule,
        EventStoreModule,
      ],
      providers: [CheckProjectInvitationHandler],
    }).compile();

    handler = module.get<CheckProjectInvitationHandler>(
      CheckProjectInvitationHandler,
    );

    projectRepository = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY);
    projectInvitationRepository = module.get<ProjectInvitationRepositoryPort>(
      PROJECT_INVITATION_REPOSITORY,
    );
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = CheckProjectInvitationCommandFactory.build();

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

    describe('식별자와 일치하는 초대장이 존재하고', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let invitation: ProjectInvitation;

      beforeEach(async () => {
        invitation = await projectInvitationRepository.insert(
          ProjectInvitationFactory.build({
            id: command.invitationId,
            projectId: command.projectId,
            inviteeId: command.currentUserId,
            status: ProjectInvitationStatus.pending,
          }),
        );
      });

      describe('지원자 본인이 체크하는 경우', () => {
        describe('초대장을 체크하면', () => {
          it('초대장이 체크돼야한다.', async () => {
            await expect(handler.execute(command)).resolves.toEqual(
              expect.objectContaining({
                status: ProjectInvitationStatus.checked,
              }),
            );
            expect(eventStore.storeAggregateEvents).toHaveBeenCalled();
          });
        });
      });

      describe('초대받지 않은 사람이 체크하려는 경우', () => {
        describe('초대장을 체크하면', () => {
          it('초대받은 사람만 초대장를 체크할 수 있다는 에러가 발생해야한다.', async () => {
            await expect(
              handler.execute({
                ...command,
                currentUserId: generateEntityId(),
              }),
            ).rejects.toThrow(ProjectInvitationChangeStatusRestrictedError);
          });
        });
      });
    });

    describe('식별자와 일치하는 초대장이 존재하지 않는 경우', () => {
      describe('초대장을 체크하면', () => {
        it('초대장이 존재하지 않는다는 에러가 발생해야한다.', async () => {
          await expect(handler.execute(command)).rejects.toThrow(
            ProjectInvitationNotFoundError,
          );
        });
      });
    });
  });

  describe('식별자와 일치하는 프로젝트가 존재하지 않는 경우', () => {
    describe('초대장 상태를 변경하면', () => {
      it('프로젝트가 존재하지 않는다는 에러가 발생해야한다.', async () => {
        await expect(handler.execute(command)).rejects.toThrow(
          ProjectNotFoundError,
        );
      });
    });
  });
});
