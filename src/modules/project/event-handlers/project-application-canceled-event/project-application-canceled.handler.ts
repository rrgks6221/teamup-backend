import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';

import { ProjectApplicationCanceledEvent } from '@module/project/events/project-application-canceled.event';

/**
 * @todo 메일 발송
 */
@EventsHandler(ProjectApplicationCanceledEvent)
export class ProjectApplicationCanceledHandler
  implements IEventHandler<ProjectApplicationCanceledEvent>
{
  constructor() {}

  @OnEvent(ProjectApplicationCanceledEvent.name)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handle(event: ProjectApplicationCanceledEvent) {}
}
