import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';

import {
  ProjectMember,
  ProjectMemberRole,
} from '@module/project/entities/project-member.entity';
import { ProjectInvitationApprovedEvent } from '@module/project/events/project-invitation-approved.event';
import { CreateProjectMemberCommand } from '@module/project/use-cases/create-project-member/create-project-member.command';

/**
 * @todo 메일 발송
 */
@EventsHandler(ProjectInvitationApprovedEvent)
export class ProjectInvitationApprovedHandler
  implements IEventHandler<ProjectInvitationApprovedEvent>
{
  constructor(private readonly commandBus: CommandBus) {}

  @OnEvent(ProjectInvitationApprovedEvent.name)
  async handle(event: ProjectInvitationApprovedEvent) {
    const { eventPayload } = event;

    const command = new CreateProjectMemberCommand({
      accountId: eventPayload.inviteeId,
      projectId: eventPayload.projectId,
      positionName: eventPayload.positionName,
      role: ProjectMemberRole.member,
    });

    await this.commandBus.execute<CreateProjectMemberCommand, ProjectMember>(
      command,
    );
  }
}
