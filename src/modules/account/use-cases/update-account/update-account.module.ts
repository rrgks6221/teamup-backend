import { Module } from '@nestjs/common';

import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { UpdateAccountController } from '@module/account/use-cases/update-account/update-account.controller';
import { UpdateAccountHandler } from '@module/account/use-cases/update-account/update-account.handler';
import { PositionServiceModule } from '@module/position/services/position-service/position-service.module';
import { TechStackServiceModule } from '@module/tech-stack/services/tech-stack-service/tech-stack-service.module';

@Module({
  imports: [
    AccountRepositoryModule,
    PositionServiceModule,
    TechStackServiceModule,
  ],
  controllers: [UpdateAccountController],
  providers: [UpdateAccountHandler],
})
export class UpdateAccountModule {}
