import { Module } from '@nestjs/common';

import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { ProjectMemberRepositoryModule } from '@module/project/repositories/project-member.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { CreateProjectMemberHandler } from '@module/project/use-cases/create-project-member/create-project-member.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    AccountRepositoryModule,
    ProjectRepositoryModule,
    ProjectMemberRepositoryModule,
    EventStoreModule,
  ],
  providers: [CreateProjectMemberHandler],
})
export class CreateProjectMemberModule {}
