import { Inject, Injectable } from '@nestjs/common';

import { Account } from '@module/account/entities/account.entity';
import { AccountNicknameAlreadyOccupiedError } from '@module/account/errors/account-nickname-already-occupied.error';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import {
  IUpdateAccountService,
  UpdateAccountCommand,
} from '@module/account/use-cases/update-account/update-account.service.interface';

@Injectable()
export class UpdateAccountService implements IUpdateAccountService {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepositoryPort,
  ) {}

  async execute(command: UpdateAccountCommand): Promise<Account> {
    const account = await this.accountRepository.findOneById(command.accountId);

    if (account === undefined) {
      throw new AccountNotFoundError();
    }

    account.update({ nickname: command.nickname });

    if (command.nickname !== undefined) {
      const sameNicknameAccount =
        await this.accountRepository.findOneByNickname(account.nickname);

      if (sameNicknameAccount !== undefined) {
        if (account.isSameNicknameAccount(sameNicknameAccount)) {
          throw new AccountNicknameAlreadyOccupiedError();
        }
      }
    }

    await this.accountRepository.update(account);

    return account;
  }
}
