import { Module } from '@nestjs/common';

import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { GetAccountController } from '@module/account/use-cases/get-account/get-account.controller';
import { GetAccountHandler } from '@module/account/use-cases/get-account/get-account.handler';

@Module({
  imports: [AccountRepositoryModule],
  controllers: [GetAccountController],
  providers: [GetAccountHandler],
})
export class GetAccountModule {}
