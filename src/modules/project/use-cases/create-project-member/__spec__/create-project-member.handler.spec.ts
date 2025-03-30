import { Test, TestingModule } from '@nestjs/testing';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
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
import { CreateProjectMemberCommandFactory } from '@module/project/use-cases/create-project-member/__spec__/create-project-member-command.factory';
import { CreateProjectMemberCommand } from '@module/project/use-cases/create-project-member/create-project-member.command';
import { CreateProjectMemberHandler } from '@module/project/use-cases/create-project-member/create-project-member.handler';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(CreateProjectMemberHandler.name, () => {
  let handler: CreateProjectMemberHandler;

  let accountRepository: AccountRepositoryPort;
  let projectRepository: ProjectRepositoryPort;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let projectMemberRepository: ProjectMemberRepositoryPort;
  let eventStore: IEventStore;

  let command: CreateProjectMemberCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AccountRepositoryModule,
        ProjectRepositoryModule,
        ProjectMemberRepositoryModule,
        EventStoreModule,
      ],
      providers: [CreateProjectMemberHandler],
    }).compile();

    handler = module.get<CreateProjectMemberHandler>(
      CreateProjectMemberHandler,
    );

    accountRepository = module.get<AccountRepositoryPort>(ACCOUNT_REPOSITORY);
    projectRepository = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY);
    projectMemberRepository = module.get<ProjectMemberRepositoryPort>(
      PROJECT_MEMBER_REPOSITORY,
    );
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = CreateProjectMemberCommandFactory.build();

    jest.spyOn(eventStore, 'storeAggregateEvents');
  });

  describe('프로젝트 식별자에 해당하는 프로젝트가 존재하고', () => {
    beforeEach(async () => {
      await projectRepository.insert(
        ProjectFactory.build({ id: command.projectId }),
      );
    });

    describe('계정 식별자에 해당하는 계정이 존재하고', () => {
      beforeEach(async () => {
        await accountRepository.insert(
          AccountFactory.build({ id: command.accountId }),
        );
      });

      describe('구성원을 생성하면', () => {
        it('구성원이 생성되고 이벤트를 저장해야한다.', async () => {
          await expect(handler.execute(command)).resolves.toEqual(
            expect.objectContaining({
              accountId: command.accountId,
              projectId: command.projectId,
              positionName: command.positionName,
              role: command.role,
            }),
          );

          expect(eventStore.storeAggregateEvents).toHaveBeenCalled();
        });
      });
    });

    describe('계정 식별자에 해당하는 계정이 존재하지 않는 경우', () => {
      describe('구성원을 생성하면', () => {
        it('계정이 존재하지 않는다은 에러가 발생해야한다.', async () => {
          await expect(handler.execute(command)).rejects.toThrow(
            AccountNotFoundError,
          );
        });
      });
    });
  });

  describe('프로젝트 식별자에 해당하는 프로젝트가 존재하지 않는 경우', () => {
    describe('구성원을 생성하면', () => {
      it('프로젝트가 존재하지 않는다는 에러가 발생해야한다.', async () => {
        await expect(handler.execute(command)).rejects.toThrow(
          ProjectNotFoundError,
        );
      });
    });
  });
});
