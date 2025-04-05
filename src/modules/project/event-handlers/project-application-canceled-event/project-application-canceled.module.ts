import { Module } from '@nestjs/common';

import { ProjectApplicationCanceledHandler } from '@module/project/event-handlers/project-application-canceled-event/project-application-canceled.handler';

@Module({
  providers: [ProjectApplicationCanceledHandler],
})
export class ProjectApplicationCanceledModule {}
