import { Module } from '@nestjs/common';

import { ProjectApplicationRepositoryModule } from '@module/project/repositories/project-application.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { RejectProjectApplicationController } from '@module/project/use-cases/reject-project-application/reject-project-application.controller';
import { RejectProjectApplicationHandler } from '@module/project/use-cases/reject-project-application/reject-project-application.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    ProjectRepositoryModule,
    ProjectApplicationRepositoryModule,
    EventStoreModule,
  ],
  controllers: [RejectProjectApplicationController],
  providers: [RejectProjectApplicationHandler],
})
export class RejectProjectApplicationModule {}
