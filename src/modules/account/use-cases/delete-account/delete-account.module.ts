import { Module } from '@nestjs/common';

import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { DeleteAccountHandler } from '@module/account/use-cases/delete-account/delete-account.handler';

@Module({
  imports: [AccountRepositoryModule],
  providers: [DeleteAccountHandler],
})
export class DeleteAccountModule {}
