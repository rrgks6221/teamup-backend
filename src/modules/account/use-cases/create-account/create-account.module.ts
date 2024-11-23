import { Module } from '@nestjs/common';

import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { CreateAccountHandler } from '@module/account/use-cases/create-account/create-account.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [AccountRepositoryModule, EventStoreModule],
  providers: [CreateAccountHandler],
})
export class CreateAccountModule {}
