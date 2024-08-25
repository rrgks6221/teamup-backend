import { Module } from '@nestjs/common';

import { TechStackRepository } from '@module/tech-stack/repositories/tech-stack.repository';
import { TECH_STACK_REPOSITORY } from '@module/tech-stack/repositories/tech-stack.repository.port';

import { PrismaModule } from '@shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: TECH_STACK_REPOSITORY,
      useClass: TechStackRepository,
    },
  ],
  exports: [TECH_STACK_REPOSITORY],
})
export class TechStackRepositoryModule {}
