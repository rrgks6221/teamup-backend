import { Module } from '@nestjs/common';

import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { GetAccountByUsernameHandler } from '@module/account/use-cases/get-account-by-username/get-account-by-username.handler';

@Module({
  imports: [AccountRepositoryModule],
  providers: [GetAccountByUsernameHandler],
})
export class GetAccountByUsernameModule {}
