import { Module } from '@nestjs/common';

import { PositionRepositoryModule } from '@module/position/repositories/position.repository.module';
import { ListPositionsController } from '@module/position/use-cases/list-positions/list-positions.controller';
import { ListPositionsService } from '@module/position/use-cases/list-positions/list-positions.service';
import { LIST_POSITIONS_SERVICE } from '@module/position/use-cases/list-positions/list-positions.service.interface';

@Module({
  imports: [PositionRepositoryModule],
  controllers: [ListPositionsController],
  providers: [
    {
      provide: LIST_POSITIONS_SERVICE,
      useClass: ListPositionsService,
    },
  ],
})
export class ListPositionsModule {}
