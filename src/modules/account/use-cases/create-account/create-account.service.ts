import { Inject, Injectable } from '@nestjs/common';

import { Account } from '@module/account/entities/account.entity';
import { AccountNicknameAlreadyOccupiedError } from '@module/account/errors/account-nickname-already-occupied.error';
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
      password: command.password,
      signInType: command.signInType,
      nickname: command.nickname,
    });

    const sameNicknameAccount = await this.accountRepository.findOneByNickname(
      newAccount.nickname,
    );
    const sameUsernameAccount = await this.accountRepository.findOneByUsername(
      newAccount.username as string,
    );

    if (sameUsernameAccount !== undefined) {
      throw new AccountUsernameAlreadyOccupiedError();
    }

    if (sameNicknameAccount !== undefined) {
      if (newAccount.isSameNicknameAccount(sameNicknameAccount)) {
        throw new AccountNicknameAlreadyOccupiedError();
      }
    }

    await this.accountRepository.insert(newAccount);

    return newAccount;
  }
}
