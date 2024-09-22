import { Module } from '@nestjs/common';

import { TechStackRepositoryModule } from '@module/tech-stack/repositories/tech-stack.repository.module';
import { TechStackService } from '@module/tech-stack/services/tech-stack-service/tech-stack.service';
import { TECH_STACK_SERVICE } from '@module/tech-stack/services/tech-stack-service/tech-stack.service.interface';

@Module({
  imports: [TechStackRepositoryModule],
  providers: [
    {
      provide: TECH_STACK_SERVICE,
      useClass: TechStackService,
    },
  ],
  exports: [TECH_STACK_SERVICE],
})
export class TechStackServiceModule {}
