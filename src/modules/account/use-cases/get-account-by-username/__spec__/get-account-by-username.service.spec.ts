import { Test, TestingModule } from '@nestjs/testing';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { Account } from '@module/account/entities/account.entity';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { GetAccountByUsernameQueryFactory } from '@module/account/use-cases/get-account-by-username/__spec__/get-account-by-username-query.factory';
import { GetAccountByUsernameModule } from '@module/account/use-cases/get-account-by-username/get-account-by-username.module';
import { GetAccountByUsernameService } from '@module/account/use-cases/get-account-by-username/get-account-by-username.service';
import {
  GET_ACCOUNT_BY_USERNAME_SERVICE,
  GetAccountByUsernameQuery,
  IGetAccountByUsernameService,
} from '@module/account/use-cases/get-account-by-username/get-account-by-username.service.interface';

describe(GetAccountByUsernameService.name, () => {
  let service: IGetAccountByUsernameService;

  let accountRepository: AccountRepositoryPort;

  let query: GetAccountByUsernameQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GetAccountByUsernameModule],
    }).compile();

    service = module.get<IGetAccountByUsernameService>(
      GET_ACCOUNT_BY_USERNAME_SERVICE,
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
        await expect(service.execute(query)).resolves.toEqual(account);
      });
    });
  });

  describe('username과 일치하는 계정이 존재하지 않는 경우', () => {
    describe('계정을 조회하면', () => {
      it('계정이 존재하지 않는다는 에러가 발생한다.', async () => {
        await expect(service.execute(query)).rejects.toThrow(
          AccountNotFoundError,
        );
      });
    });
  });
});
