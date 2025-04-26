import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';

import { ProjectInvitationMarkAsCheckedEvent } from '@module/project/events/project-invitation-mark-as-checked.event';

/**
 * @todo 메일 발송
 */
@EventsHandler(ProjectInvitationMarkAsCheckedEvent)
export class ProjectInvitationMarkAsCheckedHandler
  implements IEventHandler<ProjectInvitationMarkAsCheckedEvent>
{
  constructor() {}

  @OnEvent(ProjectInvitationMarkAsCheckedEvent.name)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handle(event: ProjectInvitationMarkAsCheckedEvent) {}
}
