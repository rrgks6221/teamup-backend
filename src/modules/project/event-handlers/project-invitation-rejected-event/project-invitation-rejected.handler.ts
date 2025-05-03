import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';

import { ProjectInvitationRejectedEvent } from '@module/project/events/project-invitation-rejected.event';

/**
 * @todo 메일 발송
 */
@EventsHandler(ProjectInvitationRejectedEvent)
export class ProjectInvitationRejectedHandler
  implements IEventHandler<ProjectInvitationRejectedEvent>
{
  constructor(private readonly commandBus: CommandBus) {}

  @OnEvent(ProjectInvitationRejectedEvent.name)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handle(event: ProjectInvitationRejectedEvent) {}
}
