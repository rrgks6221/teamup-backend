import { Inject, Injectable } from '@nestjs/common';

import { Account } from '@module/account/entities/account.entity';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import {
  GetCurrentAccountQuery,
  IGetCurrentAccountService,
} from '@module/account/use-cases/get-current-account/get-current-account.service.interface';

@Injectable()
export class GetCurrentAccountService implements IGetCurrentAccountService {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepositoryPort,
  ) {}

  async execute(query: GetCurrentAccountQuery): Promise<Account> {
    const account = await this.accountRepository.findOneById(query.accountId);

    if (account === undefined) {
      throw new AccountNotFoundError();
    }

    return account;
  }
}
