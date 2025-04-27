import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { ProjectMemberFactory } from '@module/project/entities/__spec__/project-member.factory';
import { ProjectMemberRole } from '@module/project/entities/project-member.entity';
import { ProjectInvitationApprovedHandler } from '@module/project/event-handlers/project-invitation-approved-event/project-invitation-approved.handler';
import { ProjectInvitationApprovedEvent } from '@module/project/events/project-invitation-approved.event';
import { CreateProjectMemberCommand } from '@module/project/use-cases/create-project-member/create-project-member.command';

import { generateEntityId } from '@common/base/base.entity';

describe(ProjectInvitationApprovedHandler.name, () => {
  let handler: ProjectInvitationApprovedHandler;

  let commandBus: CommandBus;

  let event: ProjectInvitationApprovedEvent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [ProjectInvitationApprovedHandler],
    }).compile();

    handler = module.get<ProjectInvitationApprovedHandler>(
      ProjectInvitationApprovedHandler,
    );

    commandBus = module.get<CommandBus>(CommandBus);
  });

  beforeEach(() => {
    event = new ProjectInvitationApprovedEvent(generateEntityId(), {
      projectId: generateEntityId(),
      invitationId: generateEntityId(),
      inviteeId: generateEntityId(),
      inviterId: generateEntityId(),
      positionName: faker.string.alpha(),
    });

    jest.spyOn(commandBus, 'execute').mockResolvedValue(
      ProjectMemberFactory.build({
        projectId: event.eventPayload.projectId,
        accountId: event.eventPayload.inviteeId,
        positionName: event.eventPayload.positionName,
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
