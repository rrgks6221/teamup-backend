import { Module } from '@nestjs/common';

import { PositionRepositoryModule } from '@module/position/repositories/position.repository.module';
import { PositionService } from '@module/position/services/position-service/position.service';
import { POSITION_SERVICE } from '@module/position/services/position-service/position.service.interface';

@Module({
  imports: [PositionRepositoryModule],
  providers: [
    {
      provide: POSITION_SERVICE,
      useClass: PositionService,
    },
  ],
  exports: [POSITION_SERVICE],
})
export class PositionServiceModule {}
