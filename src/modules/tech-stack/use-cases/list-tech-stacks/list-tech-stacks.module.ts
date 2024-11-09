import { Module } from '@nestjs/common';

import { TechStackRepositoryModule } from '@module/tech-stack/repositories/tech-stack.repository.module';
import { ListTechStacksController } from '@module/tech-stack/use-cases/list-tech-stacks/list-tech-stacks.controller';
import { ListTechStacksHandler } from '@module/tech-stack/use-cases/list-tech-stacks/list-tech-stacks.handler';

@Module({
  imports: [TechStackRepositoryModule],
  controllers: [ListTechStacksController],
  providers: [ListTechStacksHandler],
})
export class ListTechStacksModule {}
