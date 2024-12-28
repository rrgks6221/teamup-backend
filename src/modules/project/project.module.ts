import { Module } from '@nestjs/common';

import { ProjectCreatedModule } from '@module/project/event-handlers/project-created-event/project-created.module';
import { ProjectMemberCreatedModule } from '@module/project/event-handlers/project-member-created-event/project-member-created.module';
import { ProjectMemberRemovedModule } from '@module/project/event-handlers/project-member-removed-event/project-member-removed.module';
import { CreateProjectModule } from '@module/project/use-cases/create-project/create-project.module';
import { RemoveProjectMemberModule } from '@module/project/use-cases/remove-project-member/remove-project-member.module';

@Module({
  imports: [
    CreateProjectModule,
    RemoveProjectMemberModule,

    // event-handlers
    ProjectCreatedModule,
    ProjectMemberCreatedModule,
    ProjectMemberRemovedModule,
  ],
})
export class ProjectModule {}
