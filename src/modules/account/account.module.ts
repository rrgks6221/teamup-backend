import { Module } from '@nestjs/common';

import { CreateAccountModule } from '@module/account/use-cases/create-account/create-account.module';
import { DeleteAccountModule } from '@module/account/use-cases/delete-account/delete-account.module';
import { GetAccountModule } from '@module/account/use-cases/get-account/get-account.module';
import { UpdateAccountModule } from '@module/account/use-cases/update-account/update-account.module';

@Module({
  imports: [
    CreateAccountModule,
    DeleteAccountModule,
    GetAccountModule,
    UpdateAccountModule,
  ],
})
export class AccountModule {}
