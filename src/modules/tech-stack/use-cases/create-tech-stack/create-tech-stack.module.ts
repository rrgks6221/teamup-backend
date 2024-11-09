import { Module } from '@nestjs/common';

import { TechStackRepositoryModule } from '@module/tech-stack/repositories/tech-stack.repository.module';
import { CreateTechStackController } from '@module/tech-stack/use-cases/create-tech-stack/create-tech-stack.controller';
import { CreateTechStackHandler } from '@module/tech-stack/use-cases/create-tech-stack/create-tech-stack.handler';

@Module({
  imports: [TechStackRepositoryModule],
  controllers: [CreateTechStackController],
  providers: [CreateTechStackHandler],
})
export class CreateTechStackModule {}
