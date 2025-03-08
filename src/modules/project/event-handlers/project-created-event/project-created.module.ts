import { Module } from '@nestjs/common';

import { ProjectCreatedHandler } from '@module/project/event-handlers/project-created-event/project-created.handler';

@Module({
  providers: [ProjectCreatedHandler],
})
export class ProjectCreatedModule {}
