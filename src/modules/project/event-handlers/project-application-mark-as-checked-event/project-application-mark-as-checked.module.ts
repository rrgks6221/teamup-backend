import { Module } from '@nestjs/common';

import { ProjectApplicationMarkAsCheckedHandler } from '@module/project/event-handlers/project-application-mark-as-checked-event/project-application-mark-as-checked.handler';

@Module({
  providers: [ProjectApplicationMarkAsCheckedHandler],
})
export class ProjectApplicationMarkAsCheckedModule {}
