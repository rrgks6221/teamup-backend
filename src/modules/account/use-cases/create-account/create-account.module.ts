import { Module } from '@nestjs/common';

import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { CreateAccountHandler } from '@module/account/use-cases/create-account/create-account.handler';

@Module({
  imports: [AccountRepositoryModule],
  providers: [CreateAccountHandler],
})
export class CreateAccountModule {}
