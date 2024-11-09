import { Test, TestingModule } from '@nestjs/testing';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { Account } from '@module/account/entities/account.entity';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { GetAccountQueryFactory } from '@module/account/use-cases/get-account/__spec__/get-account-query.factory';
import { GetAccountHandler } from '@module/account/use-cases/get-account/get-account.handler';
import { GetAccountQuery } from '@module/account/use-cases/get-account/get-account.query';

describe(GetAccountHandler.name, () => {
  let handler: GetAccountHandler;

  let accountRepository: AccountRepositoryPort;

  let query: GetAccountQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AccountRepositoryModule],
      providers: [GetAccountHandler],
    }).compile();

    handler = module.get<GetAccountHandler>(GetAccountHandler);

    accountRepository = module.get<AccountRepositoryPort>(ACCOUNT_REPOSITORY);
  });

  beforeEach(() => {
    query = GetAccountQueryFactory.build();
  });

  describe('식별자와 일치하는 계정이 존재하는 경우', () => {
    let account: Account;

    beforeEach(async () => {
      account = await accountRepository.insert(
        AccountFactory.build({ id: query.id }),
      );
    });

    describe('계정을 조회하면', () => {
      it('계정이 조회된다.', async () => {
        await expect(handler.execute(query)).resolves.toEqual(account);
      });
    });
  });

  describe('식별자와 일치하는 계정이 존재하지 않는 경우', () => {
    describe('계정을 조회하면', () => {
      it('계정이 존재하지 않는다는 에러가 발생한다.', async () => {
        await expect(handler.execute(query)).rejects.toThrow(
          AccountNotFoundError,
        );
      });
    });
  });
});
