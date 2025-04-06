import { Module } from '@nestjs/common';

import { ProjectApplicationApprovedModule } from '@module/project/event-handlers/project-application-approved-event/project-application-approved.module';
import { ProjectApplicationCanceledModule } from '@module/project/event-handlers/project-application-canceled-event/project-application-canceled.module';
import { ProjectApplicationMarkAsCheckedModule } from '@module/project/event-handlers/project-application-mark-as-checked-event/project-application-mark-as-checked.module';
import { ProjectApplicationRejectedModule } from '@module/project/event-handlers/project-application-rejected-event/project-application-rejected.module';
import { ProjectCreatedModule } from '@module/project/event-handlers/project-created-event/project-created.module';
import { ProjectMemberCreatedModule } from '@module/project/event-handlers/project-member-created-event/project-member-created.module';
import { ProjectMemberRemovedModule } from '@module/project/event-handlers/project-member-removed-event/project-member-removed.module';
import { CancelProjectApplicationModule } from '@module/project/use-cases/cancel-project-application/cancel-project-application.module';
import { ChangeProjectApplicationStatusModule } from '@module/project/use-cases/change-project-application-status/change-project-application-status.module';
import { CheckProjectApplicationModule } from '@module/project/use-cases/check-project-application/check-project-application.module';
import { CreateProjectApplicationModule } from '@module/project/use-cases/create-project-application/create-project-application.module';
import { CreateProjectMemberModule } from '@module/project/use-cases/create-project-member/create-project-member.module';
import { CreateProjectRecruitmentPostModule } from '@module/project/use-cases/create-project-recruitment-post/create-project-recruitment-post.module';
import { CreateProjectModule } from '@module/project/use-cases/create-project/create-project.module';
import { GetProjectMemberModule } from '@module/project/use-cases/get-project-member/get-project-member.module';
import { GetProjectRecruitmentPostModule } from '@module/project/use-cases/get-project-recruitment-post/get-project-recruitment-post.module';
import { GetProjectModule } from '@module/project/use-cases/get-project/get-project.module';
import { IncrementRecruitmentPostViewCountModule } from '@module/project/use-cases/increment-recruitment-post-view-count/increment-recruitment-post-view-count.module';
import { ListProjectMembersModule } from '@module/project/use-cases/list-project-members/list-project-members.module';
import { ListProjectRecruitmentPostsModule } from '@module/project/use-cases/list-project-recruitment-posts/list-project-recruitment-posts.module';
import { ListProjectsModule } from '@module/project/use-cases/list-projects/list-projects.module';
import { RemoveProjectMemberModule } from '@module/project/use-cases/remove-project-member/remove-project-member.module';

@Module({
  imports: [
    CancelProjectApplicationModule,
    ChangeProjectApplicationStatusModule,
    CheckProjectApplicationModule,
    CreateProjectModule,
    CreateProjectApplicationModule,
    CreateProjectRecruitmentPostModule,
    GetProjectModule,
    GetProjectMemberModule,
    CreateProjectMemberModule,
    GetProjectRecruitmentPostModule,
    ListProjectsModule,
    IncrementRecruitmentPostViewCountModule,
    ListProjectMembersModule,
    ListProjectRecruitmentPostsModule,
    RemoveProjectMemberModule,

    // event-handlers
    ProjectCreatedModule,
    ProjectMemberCreatedModule,
    ProjectMemberRemovedModule,
    ProjectApplicationApprovedModule,
    ProjectApplicationMarkAsCheckedModule,
    ProjectApplicationCanceledModule,
    ProjectApplicationRejectedModule,
  ],
})
export class ProjectModule {}
