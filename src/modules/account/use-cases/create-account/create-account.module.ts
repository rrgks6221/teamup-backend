import { Module } from '@nestjs/common';

import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { CreateAccountService } from '@module/account/use-cases/create-account/create-account.service';
import { CREATE_ACCOUNT_SERVICE } from '@module/account/use-cases/create-account/create-account.service.interface';

@Module({
  imports: [AccountRepositoryModule],
  providers: [
    {
      provide: CREATE_ACCOUNT_SERVICE,
      useClass: CreateAccountService,
    },
  ],
  exports: [CREATE_ACCOUNT_SERVICE],
})
export class CreateAccountModule {}
