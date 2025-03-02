import { Module } from '@nestjs/common';

import { ProjectApplicationRejectedHandler } from '@module/project/event-handlers/project-application-rejected-event/project-application-rejected.handler';

@Module({
  providers: [ProjectApplicationRejectedHandler],
})
export class ProjectApplicationRejectedModule {}
