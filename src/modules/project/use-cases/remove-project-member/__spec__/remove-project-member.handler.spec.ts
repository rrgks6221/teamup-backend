import { Test, TestingModule } from '@nestjs/testing';

import { ProjectMemberFactory } from '@module/project/entities/__spec__/project-member.factory';
import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import {
  ProjectMember,
  ProjectMemberRole,
} from '@module/project/entities/project-member.entity';
import { Project } from '@module/project/entities/project.entity';
import { ProjectMemberNotFoundError } from '@module/project/errors/project-member-not-found.error copy';
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
import { RemoveProjectMemberCommandFactory } from '@module/project/use-cases/remove-project-member/__spec__/remove-project-member-command.factory';
import { RemoveProjectMemberCommand } from '@module/project/use-cases/remove-project-member/remove-project-member.command';
import { RemoveProjectMemberHandler } from '@module/project/use-cases/remove-project-member/remove-project-member.handler';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(RemoveProjectMemberHandler.name, () => {
  let handler: RemoveProjectMemberHandler;

  let projectRepository: ProjectRepositoryPort;
  let projectMemberRepository: ProjectMemberRepositoryPort;
  let eventStore: IEventStore;

  let command: RemoveProjectMemberCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ProjectRepositoryModule,
        ProjectMemberRepositoryModule,
        EventStoreModule,
      ],
      providers: [RemoveProjectMemberHandler],
    }).compile();

    handler = module.get<RemoveProjectMemberHandler>(
      RemoveProjectMemberHandler,
    );

    projectRepository = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY);
    projectMemberRepository = module.get<ProjectMemberRepositoryPort>(
      PROJECT_MEMBER_REPOSITORY,
    );
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = RemoveProjectMemberCommandFactory.build();

    jest.spyOn(eventStore, 'storeAggregateEvents');
  });

  describe('프로젝트가 존재하고', () => {
    let project: Project;

    beforeEach(async () => {
      project = await projectRepository.insert(
        ProjectFactory.build({
          id: command.projectId,
        }),
      );
    });

    describe('구성원이 존재하고', () => {
      let projectMember: ProjectMember;

      beforeEach(async () => {
        projectMember = await projectMemberRepository.insert(
          ProjectMemberFactory.build({
            id: command.memberId,
            role: ProjectMemberRole.member,
          }),
        );
      });

      describe('본인이 프로젝트를 떠나면', () => {
        it('구성원이 제거되고 이벤트를 저장해야한다.', async () => {
          await expect(
            handler.execute({ ...command, currentUserId: projectMember.id }),
          ).resolves.toBeUndefined();
          expect(eventStore.storeAggregateEvents).toHaveBeenCalled();
        });
      });

      describe('프로젝트 소유자가 구성원을 제거하면', () => {
        it('구성원이 제거되고 이벤트를 저장해야한다.', async () => {
          await expect(
            handler.execute({ ...command, currentUserId: project.ownerId }),
          ).resolves.toBeUndefined();
          expect(eventStore.storeAggregateEvents).toHaveBeenCalled();
        });
      });
    });

    describe('구성원이 존재하지 않는 경우', () => {
      describe('구성원을 제거하면', () => {
        it('구성원이 존재하지 않는다는 에러가 발생해야한다.', async () => {
          await expect(handler.execute(command)).rejects.toThrow(
            ProjectMemberNotFoundError,
          );
        });
      });
    });
  });

  describe('프로젝트가 존재하지 않는 경우', () => {
    describe('구성원을 제거하면', () => {
      it('프로젝트가 존재하지 않는다는 에러가 발생해야한다.', async () => {
        await expect(handler.execute(command)).rejects.toThrow(
          ProjectNotFoundError,
        );
      });
    });
  });
});
