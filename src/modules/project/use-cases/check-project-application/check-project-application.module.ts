import { Module } from '@nestjs/common';

import { ProjectApplicationRepositoryModule } from '@module/project/repositories/project-application.repository.module';
import { ProjectMemberRepositoryModule } from '@module/project/repositories/project-member.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { CheckProjectApplicationController } from '@module/project/use-cases/check-project-application/check-project-application.controller';
import { CheckProjectApplicationHandler } from '@module/project/use-cases/check-project-application/check-project-application.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    ProjectRepositoryModule,
    ProjectMemberRepositoryModule,
    ProjectApplicationRepositoryModule,
    EventStoreModule,
  ],
  controllers: [CheckProjectApplicationController],
  providers: [CheckProjectApplicationHandler],
})
export class CheckProjectApplicationModule {}
