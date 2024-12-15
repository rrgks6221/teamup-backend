import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import { ProjectMemberRole } from '@module/project/entities/project-member.entity';
import { ProjectMemberCreatedHandler } from '@module/project/event-handlers/project-member-created-event/project-member-created.handler';
import { ProjectMemberCreatedEvent } from '@module/project/events/project-member-created.event';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';

import { generateEntityId } from '@common/base/base.entity';

describe(ProjectMemberCreatedHandler.name, () => {
  let handler: ProjectMemberCreatedHandler;

  let projectRepository: ProjectRepositoryPort;

  let event: ProjectMemberCreatedEvent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProjectRepositoryModule],
      providers: [ProjectMemberCreatedHandler],
    }).compile();

    handler = module.get<ProjectMemberCreatedHandler>(
      ProjectMemberCreatedHandler,
    );

    projectRepository = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY);
  });

  beforeEach(async () => {
    event = new ProjectMemberCreatedEvent(generateEntityId(), {
      accountId: generateEntityId(),
      projectId: generateEntityId(),
      position: undefined,
      role: faker.helpers.enumValue(ProjectMemberRole),
      name: faker.string.alpha(0),
      profileImagePath: undefined,
      techStackNames: undefined,
    });

    jest.spyOn(projectRepository, 'incrementMemberCount');

    await projectRepository.insert(
      ProjectFactory.build({ id: event.aggregateId }),
    );
  });

  describe('프로젝트 구성원이 생성되면', () => {
    it('프로젝트 구성원 수를 증가시켜야한다.', async () => {
      await expect(handler.handle(event)).resolves.toBeUndefined();
      expect(projectRepository.incrementMemberCount).toHaveBeenCalled();
    });
  });
});
