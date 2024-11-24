import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { DeleteAccountCommand } from '@module/account/use-cases/delete-account/delete-account.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(DeleteAccountCommand)
export class DeleteAccountHandler
  implements ICommandHandler<DeleteAccountCommand, void>
{
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepositoryPort,
    @Inject(EVENT_STORE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: DeleteAccountCommand): Promise<void> {
    const account = await this.accountRepository.findOneById(command.id);

    if (account === undefined) {
      throw new AccountNotFoundError();
    }

    await this.accountRepository.delete(account);

    await this.eventStore.storeAggregateEvents(account);
  }
}
