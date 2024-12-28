import { Module } from '@nestjs/common';

import { ProjectMemberRepositoryModule } from '@module/project/repositories/project-member.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { RemoveProjectMemberController } from '@module/project/use-cases/remove-project-member/remove-project-member.controller';
import { RemoveProjectMemberHandler } from '@module/project/use-cases/remove-project-member/remove-project-member.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    ProjectRepositoryModule,
    ProjectMemberRepositoryModule,
    EventStoreModule,
  ],
  controllers: [RemoveProjectMemberController],
  providers: [RemoveProjectMemberHandler],
})
export class RemoveProjectMemberModule {}
