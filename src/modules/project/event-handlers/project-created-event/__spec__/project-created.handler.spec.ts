import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { ProjectMemberFactory } from '@module/project/entities/__spec__/project-member.factory';
import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import { ProjectMemberRole } from '@module/project/entities/project-member.entity';
import { ProjectStatus } from '@module/project/entities/project.entity';
import { ProjectMemberAlreadyExistsError } from '@module/project/errors/project-member-already-exists.error';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectCreatedHandler } from '@module/project/event-handlers/project-created-event/project-created.handler';
import { ProjectCreatedEvent } from '@module/project/events/project-created.event';
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

import { generateEntityId } from '@common/base/base.entity';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(ProjectCreatedHandler.name, () => {
  let handler: ProjectCreatedHandler;

  let event: ProjectCreatedEvent;

  let accountRepository: AccountRepositoryPort;
  let projectRepository: ProjectRepositoryPort;
  let projectMemberRepository: ProjectMemberRepositoryPort;
  let eventStore: IEventStore;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AccountRepositoryModule,
        ProjectRepositoryModule,
        ProjectMemberRepositoryModule,
        EventStoreModule,
      ],
      providers: [ProjectCreatedHandler],
    }).compile();

    handler = module.get<ProjectCreatedHandler>(ProjectCreatedHandler);

    accountRepository = module.get<AccountRepositoryPort>(ACCOUNT_REPOSITORY);
    projectRepository = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY);
    projectMemberRepository = module.get<ProjectMemberRepositoryPort>(
      PROJECT_MEMBER_REPOSITORY,
    );
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    event = new ProjectCreatedEvent(generateEntityId(), {
      ownerId: generateEntityId(),
      name: faker.string.alpha(),
      description: faker.string.alpha(),
      status: faker.helpers.enumValue(ProjectStatus),
      category: faker.string.alpha(),
      maxMemberCount: 0,
      currentMemberCount: 0,
      tags: [],
    });

    jest.spyOn(eventStore, 'storeAggregateEvents');
  });

  describe('프로젝트 식별자에 해당하는 프로젝트가 존재하고', () => {
    beforeEach(async () => {
      await projectRepository.insert(
        ProjectFactory.build({ id: event.aggregateId }),
      );
    });

    describe('계정 식별자에 해당하는 계정이 존재하고', () => {
      beforeEach(async () => {
        await accountRepository.insert(
          AccountFactory.build({ id: event.eventPayload.ownerId }),
        );
      });

      describe('아직 프로젝트 구성원이 아닌 경우', () => {
        describe('프로젝트가 생성되면', () => {
          it('소유자 역할로 구성원이 생성되고 이벤트를 저장해야한다.', async () => {
            await expect(handler.handle(event)).resolves.toBeUndefined();

            await expect(
              projectMemberRepository.findOneByAccountInProject(
                event.aggregateId,
                event.eventPayload.ownerId,
              ),
            ).resolves.toEqual(
              expect.objectContaining({
                role: ProjectMemberRole.owner,
              }),
            );
            expect(eventStore.storeAggregateEvents).toHaveBeenCalled();
          });
        });
      });

      describe('이미 프로젝트 구성원인 경우', () => {
        beforeEach(async () => {
          await projectMemberRepository.insert(
            ProjectMemberFactory.build({
              projectId: event.aggregateId,
              accountId: event.eventPayload.ownerId,
            }),
          );
        });

        describe('프로젝트가 생성되면', () => {
          it('이미 프로젝트 구성원이라는 에러가 발생해야한다.', async () => {
            await expect(handler.handle(event)).rejects.toThrow(
              ProjectMemberAlreadyExistsError,
            );
          });
        });
      });
    });

    describe('계정 식별자에 해당하는 계정이 존재하지 않는 경우', () => {
      describe('프로젝트가 생성되면', () => {
        it('계정이 존재하지 않는다은 에러가 발생해야한다.', async () => {
          await expect(handler.handle(event)).rejects.toThrow(
            AccountNotFoundError,
          );
        });
      });
    });
  });

  describe('프로젝트 식별자에 해당하는 프로젝트가 존재하지 않는 경우', () => {
    describe('프로젝트가 생성되면', () => {
      it('프로젝트가 존재하지 않는다는 에러가 발생해야한다.', async () => {
        await expect(handler.handle(event)).rejects.toThrow(
          ProjectNotFoundError,
        );
      });
    });
  });
});
