import { Module } from '@nestjs/common';

import { TechStackRepositoryModule } from '@module/tech-stack/repositories/tech-stack.repository.module';
import { CreateTechStackController } from '@module/tech-stack/use-cases/create-tech-stack/create-tech-stack.controller';
import { CreateTechStackService } from '@module/tech-stack/use-cases/create-tech-stack/create-tech-stack.service';
import { CREATE_TECH_STACK_SERVICE } from '@module/tech-stack/use-cases/create-tech-stack/create-tech-stack.service.interface';

@Module({
  imports: [TechStackRepositoryModule],
  controllers: [CreateTechStackController],
  providers: [
    {
      provide: CREATE_TECH_STACK_SERVICE,
      useClass: CreateTechStackService,
    },
  ],
})
export class CreateTechStackModule {}
