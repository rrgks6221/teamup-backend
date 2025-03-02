import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';

import { ProjectApplicationRejectedEvent } from '@module/project/events/project-application-rejected.event';

/**
 * @todo 메일 발송
 */
@EventsHandler(ProjectApplicationRejectedEvent)
export class ProjectApplicationRejectedHandler
  implements IEventHandler<ProjectApplicationRejectedEvent>
{
  constructor() {}

  @OnEvent(ProjectApplicationRejectedEvent.name)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handle(event: ProjectApplicationRejectedEvent) {}
}
