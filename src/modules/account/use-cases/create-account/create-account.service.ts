import { Inject, Injectable } from '@nestjs/common';

import bcrypt from 'bcrypt';

import { Account } from '@module/account/entities/account.entity';
import { AccountUsernameAlreadyOccupiedError } from '@module/account/errors/account-username-already-occupied.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import {
  CreateAccountCommand,
  ICreateAccountService,
} from '@module/account/use-cases/create-account/create-account.service.interface';

@Injectable()
export class CreateAccountService implements ICreateAccountService {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepositoryPort,
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

    return newAccount;
  }
}
