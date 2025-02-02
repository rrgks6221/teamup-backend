import { Module } from '@nestjs/common';

import { PositionRepository } from '@module/position/repositories/position.repository';
import { POSITION_REPOSITORY } from '@module/position/repositories/position.repository.port';

import { PrismaModule } from '@shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: POSITION_REPOSITORY,
      useClass: PositionRepository,
    },
  ],
  exports: [POSITION_REPOSITORY],
})
export class PositionRepositoryModule {}
