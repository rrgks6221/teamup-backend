import { Test, TestingModule } from '@nestjs/testing';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { Account } from '@module/account/entities/account.entity';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { GetAccountByUsernameQueryFactory } from '@module/account/use-cases/get-account-by-username/__spec__/get-account-by-username-query.factory';
import { GetAccountByUsernameHandler } from '@module/account/use-cases/get-account-by-username/get-account-by-username.handler';
import { GetAccountByUsernameQuery } from '@module/account/use-cases/get-account-by-username/get-account-by-username.query';

describe(GetAccountByUsernameHandler.name, () => {
  let handler: GetAccountByUsernameHandler;

  let accountRepository: AccountRepositoryPort;

  let query: GetAccountByUsernameQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AccountRepositoryModule],
      providers: [GetAccountByUsernameHandler],
    }).compile();

    handler = module.get<GetAccountByUsernameHandler>(
      GetAccountByUsernameHandler,
    );

    accountRepository = module.get<AccountRepositoryPort>(ACCOUNT_REPOSITORY);
  });

  beforeEach(() => {
    query = GetAccountByUsernameQueryFactory.build();
  });

  describe('username과 일치하는 계정이 존재하는 경우', () => {
    let account: Account;

    beforeEach(async () => {
      account = await accountRepository.insert(
        AccountFactory.build({ username: query.username }),
      );
    });

    describe('계정을 조회하면', () => {
      it('계정이 조회된다.', async () => {
        await expect(handler.execute(query)).resolves.toEqual(account);
      });
    });
  });

  describe('username과 일치하는 계정이 존재하지 않는 경우', () => {
    describe('계정을 조회하면', () => {
      it('계정이 존재하지 않는다는 에러가 발생한다.', async () => {
        await expect(handler.execute(query)).rejects.toThrow(
          AccountNotFoundError,
        );
      });
    });
  });
});
