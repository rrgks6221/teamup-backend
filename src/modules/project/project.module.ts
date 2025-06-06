import { Module } from '@nestjs/common';

import { ProjectApplicationApprovedModule } from '@module/project/event-handlers/project-application-approved-event/project-application-approved.module';
import { ProjectApplicationCanceledModule } from '@module/project/event-handlers/project-application-canceled-event/project-application-canceled.module';
import { ProjectApplicationMarkAsCheckedModule } from '@module/project/event-handlers/project-application-mark-as-checked-event/project-application-mark-as-checked.module';
import { ProjectApplicationRejectedModule } from '@module/project/event-handlers/project-application-rejected-event/project-application-rejected.module';
import { ProjectCreatedModule } from '@module/project/event-handlers/project-created-event/project-created.module';
import { ProjectInvitationApprovedModule } from '@module/project/event-handlers/project-invitation-approved-event/project-invitation-approved.module';
import { ProjectInvitationCanceledModule } from '@module/project/event-handlers/project-invitation-canceled-event/project-invitation-canceled.module';
import { ProjectInvitationMarkAsCheckedModule } from '@module/project/event-handlers/project-invitation-mark-as-checked-event/project-invitation-mark-as-checked.module';
import { ProjectInvitationRejectedModule } from '@module/project/event-handlers/project-invitation-rejected-event/project-invitation-rejected.module';
import { ProjectMemberCreatedModule } from '@module/project/event-handlers/project-member-created-event/project-member-created.module';
import { ProjectMemberRemovedModule } from '@module/project/event-handlers/project-member-removed-event/project-member-removed.module';
import { ApproveProjectApplicationModule } from '@module/project/use-cases/approve-project-application/approve-project-application.module';
import { ApproveProjectInvitationModule } from '@module/project/use-cases/approve-project-invitation/approve-project-invitation.module';
import { CancelProjectApplicationModule } from '@module/project/use-cases/cancel-project-application/cancel-project-application.module';
import { CancelProjectInvitationModule } from '@module/project/use-cases/cancel-project-invitation/cancel-project-invitation.module';
import { CheckProjectApplicationModule } from '@module/project/use-cases/check-project-application/check-project-application.module';
import { CreateProjectApplicationModule } from '@module/project/use-cases/create-project-application/create-project-application.module';
import { CreateProjectInvitationModule } from '@module/project/use-cases/create-project-invitation/create-project-invitation.module';
import { CreateProjectMemberModule } from '@module/project/use-cases/create-project-member/create-project-member.module';
import { CreateProjectRecruitmentPostModule } from '@module/project/use-cases/create-project-recruitment-post/create-project-recruitment-post.module';
import { CreateProjectModule } from '@module/project/use-cases/create-project/create-project.module';
import { GetProjectApplicationModule } from '@module/project/use-cases/get-project-application/get-project-application.module';
import { GetProjectMemberModule } from '@module/project/use-cases/get-project-member/get-project-member.module';
import { GetProjectRecruitmentPostModule } from '@module/project/use-cases/get-project-recruitment-post/get-project-recruitment-post.module';
import { GetProjectModule } from '@module/project/use-cases/get-project/get-project.module';
import { IncrementRecruitmentPostViewCountModule } from '@module/project/use-cases/increment-recruitment-post-view-count/increment-recruitment-post-view-count.module';
import { ListProjectApplicationsModule } from '@module/project/use-cases/list-project-applications/list-project-applications.module';
import { ListProjectInvitationsModule } from '@module/project/use-cases/list-project-invitations/list-project-invitations.module';
import { ListProjectMembersModule } from '@module/project/use-cases/list-project-members/list-project-members.module';
import { ListProjectRecruitmentPostsModule } from '@module/project/use-cases/list-project-recruitment-posts/list-project-recruitment-posts.module';
import { ListProjectsModule } from '@module/project/use-cases/list-projects/list-projects.module';
import { RejectProjectApplicationModule } from '@module/project/use-cases/reject-project-application/reject-project-application.module';
import { RejectProjectInvitationModule } from '@module/project/use-cases/reject-project-invitation/reject-project-invitation.module';
import { RemoveProjectMemberModule } from '@module/project/use-cases/remove-project-member/remove-project-member.module';

@Module({
  imports: [
    ApproveProjectApplicationModule,
    ApproveProjectInvitationModule,
    CancelProjectApplicationModule,
    CancelProjectInvitationModule,
    CheckProjectApplicationModule,
    CreateProjectInvitationModule,
    CreateProjectModule,
    CreateProjectApplicationModule,
    CreateProjectInvitationModule,
    CreateProjectRecruitmentPostModule,
    GetProjectModule,
    GetProjectMemberModule,
    GetProjectApplicationModule,
    CreateProjectMemberModule,
    GetProjectRecruitmentPostModule,
    ListProjectsModule,
    IncrementRecruitmentPostViewCountModule,
    ListProjectApplicationsModule,
    ListProjectInvitationsModule,
    ListProjectMembersModule,
    ListProjectRecruitmentPostsModule,
    RejectProjectApplicationModule,
    RejectProjectInvitationModule,
    RemoveProjectMemberModule,

    // event-handlers
    ProjectCreatedModule,
    ProjectMemberCreatedModule,
    ProjectMemberRemovedModule,
    ProjectApplicationApprovedModule,
    ProjectApplicationMarkAsCheckedModule,
    ProjectApplicationCanceledModule,
    ProjectApplicationRejectedModule,
    ProjectInvitationMarkAsCheckedModule,
    ProjectInvitationApprovedModule,
    ProjectInvitationRejectedModule,
    ProjectInvitationCanceledModule,
  ],
})
export class ProjectModule {}
