import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import bcrypt from 'bcrypt';

import { Account } from '@module/account/entities/account.entity';
import { AccountUsernameAlreadyOccupiedError } from '@module/account/errors/account-username-already-occupied.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { CreateAccountCommand } from '@module/account/use-cases/create-account/create-account.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand, Account>
{
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepositoryPort,
    @Inject(EVENT_STORE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: CreateAccountCommand): Promise<Account> {
    const newAccount = Account.createByUsername({
      username: command.username,
      password: await bcrypt.hash(command.password, 10),
      signInType: command.signInType,
      name: command.name,
    });

    const sameUsernameAccount = await this.accountRepository.findOneByUsername(
      newAccount.username as string,
    );

    if (sameUsernameAccount !== undefined) {
      throw new AccountUsernameAlreadyOccupiedError();
    }

    await this.accountRepository.insert(newAccount);

    await this.eventStore.storeAggregateEvents(newAccount);

    return newAccount;
  }
}
