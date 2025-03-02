import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';

import { ProjectApplicationMarkAsCheckedEvent } from '@module/project/events/project-application-mark-as-checked.event';

/**
 * @todo 메일 발송
 */
@EventsHandler(ProjectApplicationMarkAsCheckedEvent)
export class ProjectApplicationMarkAsCheckedHandler
  implements IEventHandler<ProjectApplicationMarkAsCheckedEvent>
{
  constructor() {}

  @OnEvent(ProjectApplicationMarkAsCheckedEvent.name)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handle(event: ProjectApplicationMarkAsCheckedEvent) {}
}
