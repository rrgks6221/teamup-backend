import { Module } from '@nestjs/common';

import { PositionServiceModule } from '@module/position/services/position-service/position-service.module';
import { ProjectApplicationRepositoryModule } from '@module/project/repositories/project-application.repository.module';
import { ProjectMemberRepositoryModule } from '@module/project/repositories/project-member.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { CreateProjectApplicationController } from '@module/project/use-cases/create-project-application/create-project-application.controller';
import { CreateProjectApplicationHandler } from '@module/project/use-cases/create-project-application/create-project-application.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    ProjectRepositoryModule,
    ProjectMemberRepositoryModule,
    ProjectApplicationRepositoryModule,
    PositionServiceModule,
    EventStoreModule,
  ],
  controllers: [CreateProjectApplicationController],
  providers: [CreateProjectApplicationHandler],
})
export class CreateProjectApplicationModule {}
