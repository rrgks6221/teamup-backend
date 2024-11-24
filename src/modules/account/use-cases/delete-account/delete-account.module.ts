import { Module } from '@nestjs/common';

import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { DeleteAccountHandler } from '@module/account/use-cases/delete-account/delete-account.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [AccountRepositoryModule, EventStoreModule],
  providers: [DeleteAccountHandler],
})
export class DeleteAccountModule {}
