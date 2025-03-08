import { Module } from '@nestjs/common';

import { ProjectApplicationApprovedHandler } from '@module/project/event-handlers/project-application-approved-event/project-application-approved.handler';

@Module({
  providers: [ProjectApplicationApprovedHandler],
})
export class ProjectApplicationApprovedModule {}
