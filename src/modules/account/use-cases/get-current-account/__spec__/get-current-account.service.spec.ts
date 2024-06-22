import { Test, TestingModule } from '@nestjs/testing';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { Account } from '@module/account/entities/account.entity';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { GetCurrentAccountQueryFactory } from '@module/account/use-cases/get-current-account/__spec__/get-current-account-query.factory';
import { GetCurrentAccountService } from '@module/account/use-cases/get-current-account/get-current-account.service';
import {
  GET_CURRENT_ACCOUNT_SERVICE,
  GetCurrentAccountQuery,
} from '@module/account/use-cases/get-current-account/get-current-account.service.interface';

describe('GetCurrentAccountService', () => {
  let service: GetCurrentAccountService;

  let accountRepository: AccountRepositoryPort;

  let query: GetCurrentAccountQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AccountRepositoryModule],
      providers: [
        {
          provide: GET_CURRENT_ACCOUNT_SERVICE,
          useClass: GetCurrentAccountService,
        },
      ],
    }).compile();

    service = module.get<GetCurrentAccountService>(GET_CURRENT_ACCOUNT_SERVICE);

    accountRepository = module.get<AccountRepositoryPort>(ACCOUNT_REPOSITORY);
  });

  beforeEach(() => {
    query = GetCurrentAccountQueryFactory.build();
  });

  describe('현재 사용자가 존재하는 경우', () => {
    let account: Account;

    beforeEach(async () => {
      account = await accountRepository.insert(
        AccountFactory.build({ id: query.accountId }),
      );
    });

    describe('계정을 조회하면', () => {
      it('계정이 조회된다.', async () => {
        await expect(service.execute(query)).resolves.toEqual(account);
      });
    });
  });

  describe('현재 사용자가 존재하지 않는 경우', () => {
    describe('계정을 조회하면', () => {
      it('계정이 존재하지 않는다는 에러가 발생한다.', async () => {
        await expect(service.execute(query)).rejects.toThrow(
          AccountNotFoundError,
        );
      });
    });
  });
});
