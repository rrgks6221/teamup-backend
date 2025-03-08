import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { ProjectMemberFactory } from '@module/project/entities/__spec__/project-member.factory';
import { ProjectMemberRole } from '@module/project/entities/project-member.entity';
import { ProjectApplicationApprovedHandler } from '@module/project/event-handlers/project-application-approved-event/project-application-approved.handler';
import { ProjectApplicationApprovedEvent } from '@module/project/events/project-application-approved.event';
import { CreateProjectMemberCommand } from '@module/project/use-cases/create-project-member/create-project-member.command';

import { generateEntityId } from '@common/base/base.entity';

describe(ProjectApplicationApprovedHandler.name, () => {
  let handler: ProjectApplicationApprovedHandler;

  let commandBus: CommandBus;

  let event: ProjectApplicationApprovedEvent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [ProjectApplicationApprovedHandler],
    }).compile();

    handler = module.get<ProjectApplicationApprovedHandler>(
      ProjectApplicationApprovedHandler,
    );

    commandBus = module.get<CommandBus>(CommandBus);
  });

  beforeEach(() => {
    event = new ProjectApplicationApprovedEvent(generateEntityId(), {
      projectId: generateEntityId(),
      applicantId: generateEntityId(),
      applicationId: generateEntityId(),
      position: faker.string.alpha(),
    });

    jest.spyOn(commandBus, 'execute').mockResolvedValue(
      ProjectMemberFactory.build({
        projectId: event.eventPayload.projectId,
        accountId: event.eventPayload.applicantId,
        position: event.eventPayload.position,
        role: ProjectMemberRole.member,
      }),
    );
  });

  describe('지원서가 승인되면', () => {
    it('프로젝트 구성원을 생성해야한다.', async () => {
      await expect(handler.handle(event)).resolves.toBeUndefined();

      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(CreateProjectMemberCommand),
      );
    });
  });
});
