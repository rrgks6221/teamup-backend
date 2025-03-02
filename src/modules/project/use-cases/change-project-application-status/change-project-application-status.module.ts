import { Module } from '@nestjs/common';

import { ProjectApplicationRepositoryModule } from '@module/project/repositories/project-application.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { ChangeProjectApplicationStatusController } from '@module/project/use-cases/change-project-application-status/change-project-application-status.controller';
import { ChangeProjectApplicationStatusHandler } from '@module/project/use-cases/change-project-application-status/change-project-application-status.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    ProjectRepositoryModule,
    ProjectApplicationRepositoryModule,
    EventStoreModule,
  ],
  controllers: [ChangeProjectApplicationStatusController],
  providers: [ChangeProjectApplicationStatusHandler],
})
export class ChangeProjectApplicationStatusModule {}
