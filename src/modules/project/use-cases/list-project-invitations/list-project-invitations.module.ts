import { Module } from '@nestjs/common';

import { ProjectInvitationRepositoryModule } from '@module/project/repositories/project-invitation.repository.module';
import { ProjectMemberRepositoryModule } from '@module/project/repositories/project-member.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { ListProjectInvitationsController } from '@module/project/use-cases/list-project-invitations/list-project-invitations.controller';
import { ListProjectInvitationsHandler } from '@module/project/use-cases/list-project-invitations/list-project-invitations.handler';

@Module({
  imports: [
    ProjectRepositoryModule,
    ProjectMemberRepositoryModule,
    ProjectInvitationRepositoryModule,
  ],
  controllers: [ListProjectInvitationsController],
  providers: [ListProjectInvitationsHandler],
})
export class ListProjectInvitationsModule {}
