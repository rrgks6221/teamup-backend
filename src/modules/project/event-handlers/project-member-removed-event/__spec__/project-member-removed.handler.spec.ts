import { Test, TestingModule } from '@nestjs/testing';

import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import { ProjectMemberRemovedHandler } from '@module/project/event-handlers/project-member-removed-event/project-member-removed.handler';
import { ProjectMemberRemovedEvent } from '@module/project/events/project-member-Removed.event';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';

import { generateEntityId } from '@common/base/base.entity';

describe(ProjectMemberRemovedHandler.name, () => {
  let handler: ProjectMemberRemovedHandler;

  let projectRepository: ProjectRepositoryPort;

  let event: ProjectMemberRemovedEvent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProjectRepositoryModule],
      providers: [ProjectMemberRemovedHandler],
    }).compile();

    handler = module.get<ProjectMemberRemovedHandler>(
      ProjectMemberRemovedHandler,
    );

    projectRepository = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY);
  });

  beforeEach(async () => {
    event = new ProjectMemberRemovedEvent(generateEntityId(), {
      accountId: generateEntityId(),
      projectId: generateEntityId(),
      memberId: generateEntityId(),
    });

    jest.spyOn(projectRepository, 'decrementMemberCount');

    await projectRepository.insert(
      ProjectFactory.build({ id: event.aggregateId }),
    );
  });

  describe('프로젝트 구성원이 생성되면', () => {
    it('프로젝트 구성원 수를 감소시켜야한다.', async () => {
      await expect(handler.handle(event)).resolves.toBeUndefined();
      expect(projectRepository.decrementMemberCount).toHaveBeenCalled();
    });
  });
});
