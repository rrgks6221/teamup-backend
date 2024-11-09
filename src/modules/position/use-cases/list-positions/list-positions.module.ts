import { Module } from '@nestjs/common';

import { PositionRepositoryModule } from '@module/position/repositories/position.repository.module';
import { ListPositionsController } from '@module/position/use-cases/list-positions/list-positions.controller';
import { ListPositionsHandler } from '@module/position/use-cases/list-positions/list-positions.handler';

@Module({
  imports: [PositionRepositoryModule],
  controllers: [ListPositionsController],
  providers: [ListPositionsHandler],
})
export class ListPositionsModule {}
