import { Module } from '@nestjs/common';

import { ProjectCreatedModule } from '@module/project/event-handlers/project-created-event/project-created.module';
import { ProjectMemberCreatedModule } from '@module/project/event-handlers/project-member-created-event/project-member-created.module';
import { ProjectMemberRemovedModule } from '@module/project/event-handlers/project-member-removed-event/project-member-removed.module';
import { CreateProjectRecruitmentPostModule } from '@module/project/use-cases/create-project-recruitment-post/create-project-recruitment-post.module';
import { CreateProjectModule } from '@module/project/use-cases/create-project/create-project.module';
import { GetProjectMemberModule } from '@module/project/use-cases/get-project-member/get-project-member.module';
import { GetProjectModule } from '@module/project/use-cases/get-project/get-project.module';
import { ListProjectMembersModule } from '@module/project/use-cases/list-project-members/list-project-members.module';
import { ListProjectsModule } from '@module/project/use-cases/list-projects/list-projects.module';
import { RemoveProjectMemberModule } from '@module/project/use-cases/remove-project-member/remove-project-member.module';

@Module({
  imports: [
    CreateProjectModule,
    CreateProjectRecruitmentPostModule,
    GetProjectModule,
    GetProjectMemberModule,
    ListProjectsModule,
    ListProjectMembersModule,
    RemoveProjectMemberModule,

    // event-handlers
    ProjectCreatedModule,
    ProjectMemberCreatedModule,
    ProjectMemberRemovedModule,
  ],
})
export class ProjectModule {}
