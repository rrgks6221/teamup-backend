import { Module } from '@nestjs/common';

import { ProjectApplicationRepositoryModule } from '@module/project/repositories/project-application.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { CancelProjectApplicationController } from '@module/project/use-cases/cancel-project-application/cancel-project-application.controller';
import { CancelProjectApplicationHandler } from '@module/project/use-cases/cancel-project-application/cancel-project-application.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    ProjectRepositoryModule,
    ProjectApplicationRepositoryModule,
    EventStoreModule,
  ],
  controllers: [CancelProjectApplicationController],
  providers: [CancelProjectApplicationHandler],
})
export class CancelProjectApplicationModule {}
