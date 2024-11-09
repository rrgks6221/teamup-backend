import { Module } from '@nestjs/common';

import { PositionRepositoryModule } from '@module/position/repositories/position.repository.module';
import { CreatePositionController } from '@module/position/use-cases/create-position/create-position.controller';
import { CreatePositionHandler } from '@module/position/use-cases/create-position/create-position.handler';

@Module({
  imports: [PositionRepositoryModule],
  controllers: [CreatePositionController],
  providers: [CreatePositionHandler],
})
export class CreatePositionModule {}
