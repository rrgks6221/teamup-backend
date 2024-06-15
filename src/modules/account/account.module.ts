import { Module } from '@nestjs/common';

import { CreateAccountModule } from '@module/account/use-cases/create-account/create-account.module';
import { DeleteAccountModule } from '@module/account/use-cases/delete-account/delete-account.module';
import { GetAccountByUsernameModule } from '@module/account/use-cases/get-account-by-username/get-account-by-username.module';
import { GetAccountModule } from '@module/account/use-cases/get-account/get-account.module';
import { GetCurrentAccountModule } from '@module/account/use-cases/get-current-account/get-current-account.module';
import { UpdateAccountModule } from '@module/account/use-cases/update-account/update-account.module';

@Module({
  imports: [
    GetCurrentAccountModule,
    CreateAccountModule,
    DeleteAccountModule,
    GetAccountModule,
    GetAccountByUsernameModule,
    UpdateAccountModule,
  ],
  exports: [GetAccountByUsernameModule],
})
export class AccountModule {}
