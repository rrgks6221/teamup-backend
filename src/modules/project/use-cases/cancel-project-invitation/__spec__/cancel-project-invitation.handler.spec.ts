import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { ProjectInvitationFactory } from '@module/project/entities/__spec__/project-invitation.factory';
import { ProjectMemberFactory } from '@module/project/entities/__spec__/project-member.factory';
import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import {
  ProjectInvitation,
  ProjectInvitationStatus,
} from '@module/project/entities/project-invitation.entity';
import { ProjectMemberRole } from '@module/project/entities/project-member.entity';
import { Project } from '@module/project/entities/project.entity';
import { ProjectInvitationChangeStatusRestrictedError } from '@module/project/errors/project-invitation-change-status-restricted.error';
import { ProjectInvitationNotFoundError } from '@module/project/errors/project-invitation-not-found.error';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectInvitationRepositoryModule } from '@module/project/repositories/project-invitation.repository.module';
import {
  PROJECT_INVITATION_REPOSITORY,
  ProjectInvitationRepositoryPort,
} from '@module/project/repositories/project-invitation.repository.port';
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
import { CancelProjectInvitationCommandFactory } from '@module/project/use-cases/cancel-project-invitation/__spec__/cancel-project-invitation-command.factory';
import { CancelProjectInvitationCommand } from '@module/project/use-cases/cancel-project-invitation/cancel-project-invitation.command';
import { CancelProjectInvitationHandler } from '@module/project/use-cases/cancel-project-invitation/cancel-project-invitation.handler';

import { generateEntityId } from '@common/base/base.entity';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(CancelProjectInvitationHandler.name, () => {
  let handler: CancelProjectInvitationHandler;

  let projectRepository: ProjectRepositoryPort;
  let projectMemberRepository: ProjectMemberRepositoryPort;
  let projectInvitationRepository: ProjectInvitationRepositoryPort;
  let eventStore: IEventStore;

  let command: CancelProjectInvitationCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ProjectRepositoryModule,
        ProjectMemberRepositoryModule,
        ProjectInvitationRepositoryModule,
        EventStoreModule,
      ],
      providers: [CancelProjectInvitationHandler],
    }).compile();

    handler = module.get<CancelProjectInvitationHandler>(
      CancelProjectInvitationHandler,
    );

    projectRepository = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY);
    projectMemberRepository = module.get<ProjectMemberRepositoryPort>(
      PROJECT_MEMBER_REPOSITORY,
    );
    projectInvitationRepository = module.get<ProjectInvitationRepositoryPort>(
      PROJECT_INVITATION_REPOSITORY,
    );
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = CancelProjectInvitationCommandFactory.build();

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
            inviterId: command.currentUserId,
            status: ProjectInvitationStatus.pending,
          }),
        );
      });

      describe('프로젝트 관리자가 취소하는 경우', () => {
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

        describe('초대장을 취소하면', () => {
          it('초대장이 취소돼야한다.', async () => {
            await expect(handler.execute(command)).resolves.toEqual(
              expect.objectContaining({
                status: ProjectInvitationStatus.canceled,
              }),
            );
            expect(eventStore.storeAggregateEvents).toHaveBeenCalled();
          });
        });
      });

      describe('프로젝트 관리자가 아닌 사람이 취소하려는 경우', () => {
        beforeEach(async () => {
          await projectMemberRepository.insert(
            ProjectMemberFactory.build({
              projectId: command.projectId,
              accountId: command.currentUserId,
              role: faker.helpers.arrayElement([ProjectMemberRole.member]),
            }),
          );
        });

        describe('초대장을 취소하면', () => {
          it('관리자만 초대장를 취소할 수 있다는 에러가 발생해야한다.', async () => {
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
      describe('초대장을 취소하면', () => {
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
