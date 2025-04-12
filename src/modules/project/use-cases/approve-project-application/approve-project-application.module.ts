import { Module } from '@nestjs/common';

import { ProjectApplicationRepositoryModule } from '@module/project/repositories/project-application.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { ApproveProjectApplicationController } from '@module/project/use-cases/approve-project-application/approve-project-application.controller';
import { ApproveProjectApplicationHandler } from '@module/project/use-cases/approve-project-application/approve-project-application.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    ProjectRepositoryModule,
    ProjectApplicationRepositoryModule,
    EventStoreModule,
  ],
  controllers: [ApproveProjectApplicationController],
  providers: [ApproveProjectApplicationHandler],
})
export class ApproveProjectApplicationModule {}
