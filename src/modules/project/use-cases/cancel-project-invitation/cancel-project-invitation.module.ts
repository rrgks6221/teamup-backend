import { Module } from '@nestjs/common';

import { ProjectInvitationRepositoryModule } from '@module/project/repositories/project-invitation.repository.module';
import { ProjectMemberRepositoryModule } from '@module/project/repositories/project-member.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { CancelProjectInvitationController } from '@module/project/use-cases/cancel-project-invitation/cancel-project-invitation.controller';
import { CancelProjectInvitationHandler } from '@module/project/use-cases/cancel-project-invitation/cancel-project-invitation.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    ProjectRepositoryModule,
    ProjectMemberRepositoryModule,
    ProjectInvitationRepositoryModule,
    EventStoreModule,
  ],
  controllers: [CancelProjectInvitationController],
  providers: [CancelProjectInvitationHandler],
})
export class CancelProjectInvitationModule {}
