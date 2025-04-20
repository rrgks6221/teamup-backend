import { Module } from '@nestjs/common';

import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { PositionServiceModule } from '@module/position/services/position-service/position-service.module';
import { ProjectInvitationRepositoryModule } from '@module/project/repositories/project-invitation.repository.module';
import { ProjectMemberRepositoryModule } from '@module/project/repositories/project-member.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { CreateProjectInvitationController } from '@module/project/use-cases/create-project-invitation/create-project-invitation.controller';
import { CreateProjectInvitationHandler } from '@module/project/use-cases/create-project-invitation/create-project-invitation.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    AccountRepositoryModule,
    ProjectRepositoryModule,
    ProjectMemberRepositoryModule,
    ProjectInvitationRepositoryModule,
    PositionServiceModule,
    EventStoreModule,
  ],
  controllers: [CreateProjectInvitationController],
  providers: [CreateProjectInvitationHandler],
})
export class CreateProjectInvitationModule {}
