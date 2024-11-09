import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Account } from '@module/account/entities/account.entity';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { GetAccountByUsernameQuery } from '@module/account/use-cases/get-account-by-username/get-account-by-username.query';

@QueryHandler(GetAccountByUsernameQuery)
export class GetAccountByUsernameHandler
  implements IQueryHandler<GetAccountByUsernameQuery, Account>
{
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepositoryPort,
  ) {}

  async execute(query: GetAccountByUsernameQuery): Promise<Account> {
    const account = await this.accountRepository.findOneByUsername(
      query.username,
    );

    if (account === undefined) {
      throw new AccountNotFoundError();
    }

    return account;
  }
}
