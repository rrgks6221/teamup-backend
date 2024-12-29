import { Module } from '@nestjs/common';

import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { GetCurrentAccountController } from '@module/account/use-cases/get-current-account/get-current-account.controller';
import { GetCurrentAccountService } from '@module/account/use-cases/get-current-account/get-current-account.service';
import { GET_CURRENT_ACCOUNT_SERVICE } from '@module/account/use-cases/get-current-account/get-current-account.service.interface';

@Module({
  imports: [AccountRepositoryModule],
  controllers: [GetCurrentAccountController],
  providers: [
    {
      provide: GET_CURRENT_ACCOUNT_SERVICE,
      useClass: GetCurrentAccountService,
    },
  ],
})
export class GetCurrentAccountModule {}
