import { Module } from '@nestjs/common';

import { TechStackRepositoryModule } from '@module/tech-stack/repositories/tech-stack.repository.module';
import { CreateTechStackController } from '@module/tech-stack/use-cases/create-tech-stack/create-tech-stack.controller';
import { CreateTechStackHandler } from '@module/tech-stack/use-cases/create-tech-stack/create-tech-stack.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [TechStackRepositoryModule, EventStoreModule],
  controllers: [CreateTechStackController],
  providers: [CreateTechStackHandler],
})
export class CreateTechStackModule {}
