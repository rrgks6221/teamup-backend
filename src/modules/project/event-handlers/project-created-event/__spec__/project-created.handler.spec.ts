import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { ProjectMemberFactory } from '@module/project/entities/__spec__/project-member.factory';
import { ProjectMemberRole } from '@module/project/entities/project-member.entity';
import { ProjectStatus } from '@module/project/entities/project.entity';
import { ProjectCreatedHandler } from '@module/project/event-handlers/project-created-event/project-created.handler';
import { ProjectCreatedEvent } from '@module/project/events/project-created.event';
import { CreateProjectMemberCommand } from '@module/project/use-cases/create-project-member/create-project-member.command';

import { generateEntityId } from '@common/base/base.entity';

describe(ProjectCreatedHandler.name, () => {
  let handler: ProjectCreatedHandler;

  let commandBus: CommandBus;

  let event: ProjectCreatedEvent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [ProjectCreatedHandler],
    }).compile();

    handler = module.get<ProjectCreatedHandler>(ProjectCreatedHandler);

    commandBus = module.get<CommandBus>(CommandBus);
  });

  beforeEach(() => {
    event = new ProjectCreatedEvent(generateEntityId(), {
      ownerId: generateEntityId(),
      name: faker.string.alpha(),
      description: faker.string.alpha(),
      status: faker.helpers.enumValue(ProjectStatus),
      category: faker.string.alpha(),
      currentMemberCount: 0,
      tags: [],
    });

    jest.spyOn(commandBus, 'execute').mockResolvedValue(
      ProjectMemberFactory.build({
        projectId: event.aggregateId,
        accountId: event.eventPayload.ownerId,
        position: undefined,
        role: ProjectMemberRole.owner,
      }),
    );
  });

  describe('프로젝트가 생성되면', () => {
    it('소유자 역할로 구성원을 생성해야한다.', async () => {
      await expect(handler.handle(event)).resolves.toBeUndefined();

      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(CreateProjectMemberCommand),
      );
    });
  });
});
