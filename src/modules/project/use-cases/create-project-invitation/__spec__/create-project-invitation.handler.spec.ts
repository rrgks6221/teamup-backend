import { Test, TestingModule } from '@nestjs/testing';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { Account } from '@module/account/entities/account.entity';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { PositionFactory } from '@module/position/entities/__spec__/position.factory';
import { PositionServiceModule } from '@module/position/services/position-service/position-service.module';
import {
  IPositionService,
  POSITION_SERVICE,
} from '@module/position/services/position-service/position.service.interface';
import { ProjectMemberFactory } from '@module/project/entities/__spec__/project-member.factory';
import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import {
  ProjectMember,
  ProjectMemberRole,
} from '@module/project/entities/project-member.entity';
import { Project } from '@module/project/entities/project.entity';
import { ProjectInvitationCreationRestrictedError } from '@module/project/errors/project-invitation-creation-restricted.error';
import { ProjectMemberAlreadyExistsError } from '@module/project/errors/project-member-already-exists.error';
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
import { CreateProjectInvitationCommandFactory } from '@module/project/use-cases/create-project-invitation/__spec__/create-project-invitation-command.factory';
import { CreateProjectInvitationCommand } from '@module/project/use-cases/create-project-invitation/create-project-invitation.command';
import { CreateProjectInvitationHandler } from '@module/project/use-cases/create-project-invitation/create-project-invitation.handler';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(CreateProjectInvitationHandler.name, () => {
  let handler: CreateProjectInvitationHandler;

  let accountRepository: AccountRepositoryPort;
  let projectRepository: ProjectRepositoryPort;
  let projectMemberRepository: ProjectMemberRepositoryPort;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let projectInvitationRepository: ProjectInvitationRepositoryPort;
  let positionService: IPositionService;
  let eventStore: IEventStore;

  let command: CreateProjectInvitationCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AccountRepositoryModule,
        ProjectRepositoryModule,
        ProjectMemberRepositoryModule,
        ProjectInvitationRepositoryModule,
        PositionServiceModule,
        EventStoreModule,
      ],
      providers: [CreateProjectInvitationHandler],
    }).compile();

    handler = module.get<CreateProjectInvitationHandler>(
      CreateProjectInvitationHandler,
    );

    accountRepository = module.get<AccountRepositoryPort>(ACCOUNT_REPOSITORY);
    projectRepository = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY);
    projectMemberRepository = module.get<ProjectMemberRepositoryPort>(
      PROJECT_MEMBER_REPOSITORY,
    );
    projectInvitationRepository = module.get<ProjectInvitationRepositoryPort>(
      PROJECT_INVITATION_REPOSITORY,
    );
    positionService = module.get<IPositionService>(POSITION_SERVICE);
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = CreateProjectInvitationCommandFactory.build();

    jest.spyOn(eventStore, 'storeAggregateEvents');
    jest
      .spyOn(positionService, 'findByNamesOrFail')
      .mockResolvedValue([
        PositionFactory.build({ name: command.positionName }),
      ]);
  });

  describe('초대 대상자 계정이 존재하고', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let inviteeAccount: Account;

    beforeEach(async () => {
      inviteeAccount = await accountRepository.insert(
        AccountFactory.build({
          id: command.inviteeId,
        }),
      );
    });

    describe('초대 대상 프로젝트가 존재하고', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let project: Project;

      beforeEach(async () => {
        project = await projectRepository.insert(
          ProjectFactory.build({
            id: command.projectId,
          }),
        );
      });

      describe('초대 대상 계정이 아직 프로젝트의 구성원이 아니고', () => {
        describe('초대자가 프로젝트 관리자인 경우', () => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          let inviterMember: ProjectMember;

          beforeEach(async () => {
            inviterMember = await projectMemberRepository.insert(
              ProjectMemberFactory.build({
                projectId: command.projectId,
                accountId: command.inviterId,
                role: ProjectMemberRole.admin,
              }),
            );
          });

          describe('초대장을 생성하면', () => {
            it('초대장이 생성돼야한다.', async () => {
              await expect(handler.execute(command)).resolves.toEqual(
                expect.objectContaining({
                  projectId: command.projectId,
                  inviterId: command.inviterId,
                  inviteeId: command.inviteeId,
                  positionName: command.positionName,
                }),
              );
            });
          });
        });

        describe('초대자가 프로젝트 관리자가 아닌 경우', () => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          let inviterMember: ProjectMember;

          beforeEach(async () => {
            inviterMember = await projectMemberRepository.insert(
              ProjectMemberFactory.build({
                projectId: command.projectId,
                accountId: command.inviterId,
                role: ProjectMemberRole.member,
              }),
            );
          });

          describe('초대장을 생성하면', () => {
            it('관리자만 프로젝트에 초대할 수 있다는 에러가 발생해야한다.', async () => {
              await expect(handler.execute(command)).rejects.toThrow(
                ProjectInvitationCreationRestrictedError,
              );
            });
          });
        });
      });

      describe('초대 대상 계정이 이미 프로젝트 구성원인 경우', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let inviteeMember: ProjectMember;

        beforeEach(async () => {
          inviteeMember = await projectMemberRepository.insert(
            ProjectMemberFactory.build({
              projectId: command.projectId,
              accountId: command.inviteeId,
            }),
          );
        });

        describe('초대장을 생성하면', () => {
          it('초대 대상 이미 프로젝트 구성원이라는 에러가 발생해야한다.', async () => {
            await expect(handler.execute(command)).rejects.toThrow(
              ProjectMemberAlreadyExistsError,
            );
          });
        });
      });
    });

    describe('초대 대상 프로젝트가 존재하지 않는 경우', () => {
      describe('초대장을 생성하면', () => {
        it('초대 대상 프로젝트가 존재하지 않는다는 에러가 발생해야한다.', async () => {
          await expect(handler.execute(command)).rejects.toThrow(
            ProjectNotFoundError,
          );
        });
      });
    });
  });

  describe('초대 대상 계정이 존재하지 않는 경우', () => {
    describe('초대장을 생성하면', () => {
      it('초대 대상 계정이 존재하지 않는다는 에러가 발생해야한다.', async () => {
        await expect(handler.execute(command)).rejects.toThrow(
          AccountNotFoundError,
        );
      });
    });
  });
});
