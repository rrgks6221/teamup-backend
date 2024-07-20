import { Module } from '@nestjs/common';

import { ListPositionsModule } from '@module/position/use-cases/list-positions/list-positions.module';

@Module({
  imports: [ListPositionsModule],
})
export class PositionModule {}
