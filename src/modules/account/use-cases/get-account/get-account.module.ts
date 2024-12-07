import { Module } from '@nestjs/common';

import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { GetAccountController } from '@module/account/use-cases/get-account/get-account.controller';
import { GetAccountService } from '@module/account/use-cases/get-account/get-account.service';
import { GET_ACCOUNT_SERVICE } from '@module/account/use-cases/get-account/get-account.service.interface';

@Module({
  imports: [AccountRepositoryModule],
  controllers: [GetAccountController],
  providers: [
    {
      provide: GET_ACCOUNT_SERVICE,
      useClass: GetAccountService,
    },
  ],
})
export class GetAccountModule {}
