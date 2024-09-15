import { Module } from '@nestjs/common';

import { PositionRepositoryModule } from '@module/position/repositories/position.repository.module';
import { CreatePositionModule } from '@module/position/use-cases/create-position/create-position.module';
import { ListPositionsModule } from '@module/position/use-cases/list-positions/list-positions.module';

@Module({
  imports: [
    PositionRepositoryModule,
    ListPositionsModule,
    CreatePositionModule,
  ],
})
export class PositionModule {}
