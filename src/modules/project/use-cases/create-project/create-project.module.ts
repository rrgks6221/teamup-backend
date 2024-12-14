import { Module } from '@nestjs/common';

import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { CreateProjectController } from '@module/project/use-cases/create-project/create-project.controller';
import { CreateProjectHandler } from '@module/project/use-cases/create-project/create-project.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [ProjectRepositoryModule, EventStoreModule],
  controllers: [CreateProjectController],
  providers: [CreateProjectHandler],
})
export class CreateProjectModule {}
