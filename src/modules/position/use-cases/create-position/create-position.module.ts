import { Module } from '@nestjs/common';

import { PositionRepositoryModule } from '@module/position/repositories/position.repository.module';
import { CreatePositionController } from '@module/position/use-cases/create-position/create-position.controller';
import { CreatePositionService } from '@module/position/use-cases/create-position/create-position.service';
import { CREATE_POSITION_SERVICE } from '@module/position/use-cases/create-position/create-position.service.interface';

@Module({
  imports: [PositionRepositoryModule],
  controllers: [CreatePositionController],
  providers: [
    {
      provide: CREATE_POSITION_SERVICE,
      useClass: CreatePositionService,
    },
  ],
})
export class CreatePositionModule {}
