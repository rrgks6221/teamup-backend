import { Module } from '@nestjs/common';

import { CreatePositionModule } from '@module/position/use-cases/create-position/create-position.module';
import { ListPositionsModule } from '@module/position/use-cases/list-positions/list-positions.module';

@Module({
  imports: [ListPositionsModule, CreatePositionModule],
})
export class PositionModule {}
