import { Module } from '@nestjs/common';

import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { ProjectApplicationApprovedHandler } from '@module/project/event-handlers/project-application-approved-event/project-application-approved.handler';
import { ProjectMemberRepositoryModule } from '@module/project/repositories/project-member.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    AccountRepositoryModule,
    ProjectRepositoryModule,
    ProjectMemberRepositoryModule,
    EventStoreModule,
  ],
  providers: [ProjectApplicationApprovedHandler],
})
export class ProjectApplicationApprovedModule {}
