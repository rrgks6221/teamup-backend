import { Module } from '@nestjs/common';

import { ProjectCreatedModule } from '@module/project/event-handlers/project-created-event/project-created.module';
import { ProjectMemberCreatedModule } from '@module/project/event-handlers/project-member-created-event/project-member-created.module';
import { CreateProjectModule } from '@module/project/use-cases/create-project/create-project.module';

@Module({
  imports: [
    CreateProjectModule,

    // event-handlers
    ProjectCreatedModule,
    ProjectMemberCreatedModule,
  ],
})
export class ProjectModule {}
