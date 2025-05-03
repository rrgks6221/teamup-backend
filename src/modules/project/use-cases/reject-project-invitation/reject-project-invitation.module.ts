import { Module } from '@nestjs/common';

import { ProjectInvitationRepositoryModule } from '@module/project/repositories/project-invitation.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { RejectProjectInvitationController } from '@module/project/use-cases/reject-project-invitation/reject-project-invitation.controller';
import { RejectProjectInvitationHandler } from '@module/project/use-cases/reject-project-invitation/reject-project-invitation.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    ProjectRepositoryModule,
    ProjectInvitationRepositoryModule,
    EventStoreModule,
  ],
  controllers: [RejectProjectInvitationController],
  providers: [RejectProjectInvitationHandler],
})
export class RejectProjectInvitationModule {}
