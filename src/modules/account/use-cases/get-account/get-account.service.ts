import { Inject, Injectable } from '@nestjs/common';

import { Account } from '@module/account/entities/account.entity';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import {
  GetAccountQuery,
  IGetAccountService,
} from '@module/account/use-cases/get-account/get-account.service.interface';

@Injectable()
export class GetAccountService implements IGetAccountService {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepositoryPort,
  ) {}

  async execute(query: GetAccountQuery): Promise<Account> {
    const account = await this.accountRepository.findOneById(query.id);

    if (account === undefined) {
      throw new AccountNotFoundError();
    }

    return account;
  }
}
