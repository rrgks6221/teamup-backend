import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';

import { ProjectInvitationCanceledEvent } from '@module/project/events/project-invitation-canceled.event';

/**
 * @todo 메일 발송
 */
@EventsHandler(ProjectInvitationCanceledEvent)
export class ProjectInvitationCanceledHandler
  implements IEventHandler<ProjectInvitationCanceledEvent>
{
  constructor(private readonly commandBus: CommandBus) {}

  @OnEvent(ProjectInvitationCanceledEvent.name)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handle(event: ProjectInvitationCanceledEvent) {}
}
