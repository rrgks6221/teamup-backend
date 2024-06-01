import { Module } from '@nestjs/common';

import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { GetAccountByUsernameService } from '@module/account/use-cases/get-account-by-username/get-account-by-username.service';
import { GET_ACCOUNT_BY_USERNAME_SERVICE } from '@module/account/use-cases/get-account-by-username/get-account-by-username.service.interface';

@Module({
  imports: [AccountRepositoryModule],
  providers: [
    {
      provide: GET_ACCOUNT_BY_USERNAME_SERVICE,
      useClass: GetAccountByUsernameService,
    },
  ],
  exports: [GET_ACCOUNT_BY_USERNAME_SERVICE],
})
export class GetAccountByUsernameModule {}
