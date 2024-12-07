import { Module } from '@nestjs/common';

import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { UpdateAccountController } from '@module/account/use-cases/update-account/update-account.controller';
import { UpdateAccountService } from '@module/account/use-cases/update-account/update-account.service';
import { UPDATE_ACCOUNT_SERVICE } from '@module/account/use-cases/update-account/update-account.service.interface';

@Module({
  imports: [AccountRepositoryModule],
  controllers: [UpdateAccountController],
  providers: [
    {
      provide: UPDATE_ACCOUNT_SERVICE,
      useClass: UpdateAccountService,
    },
  ],
})
export class UpdateAccountModule {}
