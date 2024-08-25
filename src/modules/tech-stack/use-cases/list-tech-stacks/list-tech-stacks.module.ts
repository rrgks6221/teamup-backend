import { Module } from '@nestjs/common';

import { TechStackRepositoryModule } from '@module/tech-stack/repositories/tech-stack.repository.module';
import { ListTechStacksController } from '@module/tech-stack/use-cases/list-tech-stacks/list-tech-stacks.controller';
import { ListTechStacksService } from '@module/tech-stack/use-cases/list-tech-stacks/list-tech-stacks.service';
import { LIST_TECH_STACKS_SERVICE } from '@module/tech-stack/use-cases/list-tech-stacks/list-tech-stacks.service.interface';

@Module({
  imports: [TechStackRepositoryModule],
  controllers: [ListTechStacksController],
  providers: [
    {
      provide: LIST_TECH_STACKS_SERVICE,
      useClass: ListTechStacksService,
    },
  ],
})
export class ListTechStacksModule {}
