import { Module } from '@nestjs/common';

import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { ProjectCreatedHandler } from '@module/project/event-handlers/project-created-event/project-created.handler';
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
  providers: [ProjectCreatedHandler],
})
export class ProjectCreatedModule {}
