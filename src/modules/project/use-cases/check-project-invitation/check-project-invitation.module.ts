import { Module } from '@nestjs/common';

import { ProjectInvitationRepositoryModule } from '@module/project/repositories/project-invitation.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { CheckProjectInvitationController } from '@module/project/use-cases/check-project-invitation/check-project-invitation.controller';
import { CheckProjectInvitationHandler } from '@module/project/use-cases/check-project-invitation/check-project-invitation.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    ProjectRepositoryModule,
    ProjectInvitationRepositoryModule,
    EventStoreModule,
  ],
  controllers: [CheckProjectInvitationController],
  providers: [CheckProjectInvitationHandler],
})
export class CheckProjectInvitationModule {}
