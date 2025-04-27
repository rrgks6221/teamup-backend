import { Module } from '@nestjs/common';

import { ProjectInvitationRepositoryModule } from '@module/project/repositories/project-invitation.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { ApproveProjectInvitationController } from '@module/project/use-cases/approve-project-invitation/approve-project-invitation.controller';
import { ApproveProjectInvitationHandler } from '@module/project/use-cases/approve-project-invitation/approve-project-invitation.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    ProjectRepositoryModule,
    ProjectInvitationRepositoryModule,
    EventStoreModule,
  ],

  controllers: [ApproveProjectInvitationController],
  providers: [ApproveProjectInvitationHandler],
})
export class ApproveProjectInvitationModule {}
