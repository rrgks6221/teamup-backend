import { Module } from '@nestjs/common';

import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { DeleteAccountService } from '@module/account/use-cases/delete-account/delete-account.service';
import { DELETE_ACCOUNT_SERVICE } from '@module/account/use-cases/delete-account/delete-account.service.interface';

@Module({
  imports: [AccountRepositoryModule],
  providers: [
    {
      provide: DELETE_ACCOUNT_SERVICE,
      useClass: DeleteAccountService,
    },
  ],
})
export class DeleteAccountModule {}
