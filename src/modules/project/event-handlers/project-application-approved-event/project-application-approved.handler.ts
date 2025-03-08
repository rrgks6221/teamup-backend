import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';

import {
  ProjectMember,
  ProjectMemberRole,
} from '@module/project/entities/project-member.entity';
import { ProjectApplicationApprovedEvent } from '@module/project/events/project-application-approved.event';
import { CreateProjectMemberCommand } from '@module/project/use-cases/create-project-member/create-project-member.command';

/**
 * @todo 메일 발송
 */
@EventsHandler(ProjectApplicationApprovedEvent)
export class ProjectApplicationApprovedHandler
  implements IEventHandler<ProjectApplicationApprovedEvent>
{
  constructor(private readonly commandBud: CommandBus) {}

  @OnEvent(ProjectApplicationApprovedEvent.name)
  async handle(event: ProjectApplicationApprovedEvent) {
    const { eventPayload } = event;

    const command = new CreateProjectMemberCommand({
      accountId: eventPayload.applicantId,
      projectId: eventPayload.projectId,
      position: eventPayload.position,
      role: ProjectMemberRole.member,
    });

    await this.commandBud.execute<CreateProjectMemberCommand, ProjectMember>(
      command,
    );
  }
}
