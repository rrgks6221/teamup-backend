import { Test, TestingModule } from '@nestjs/testing';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { AccountNicknameAlreadyOccupiedError } from '@module/account/errors/account-nickname-already-occupied.error';
import { AccountUsernameAlreadyOccupiedError } from '@module/account/errors/account-username-already-occupied.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { CreateAccountCommandFactory } from '@module/account/use-cases/create-account/__spec__/create-account.command.factory';
import { CreateAccountModule } from '@module/account/use-cases/create-account/create-account.module';
import { CreateAccountService } from '@module/account/use-cases/create-account/create-account.service';
import {
  CREATE_ACCOUNT_SERVICE,
  CreateAccountCommand,
  ICreateAccountService,
} from '@module/account/use-cases/create-account/create-account.service.interface';

describe(CreateAccountService.name, () => {
  let service: ICreateAccountService;

  let accountRepository: AccountRepositoryPort;

  let command: CreateAccountCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CreateAccountModule],
    }).compile();

    service = module.get<ICreateAccountService>(CREATE_ACCOUNT_SERVICE);

    accountRepository = module.get<AccountRepositoryPort>(ACCOUNT_REPOSITORY);
  });

  beforeEach(() => {
    command = CreateAccountCommandFactory.build();
  });

  describe('동일한 username을 가진 계정이 없고', () => {
    describe('동일한 닉네임을 가진 계정이 없는 경우', () => {
      describe('계정을 생성하면', () => {
        it('계정이 생성된다.', async () => {
          await expect(service.execute(command)).resolves.toEqual(
            expect.objectContaining({
              username: command.username,
              nickname: command.nickname,
            }),
          );
        });
      });
    });

    describe('동일한 닉네임을 가진 계정이 있는 경우', () => {
      beforeEach(async () => {
        await accountRepository.insert(
          AccountFactory.build({ nickname: command.nickname }),
        );
      });

      describe('계정을 생성하면', () => {
        it('이미 닉네임을 사용중이란 에러가 발생한다.', async () => {
          await expect(service.execute(command)).rejects.toThrow(
            AccountNicknameAlreadyOccupiedError,
          );
        });
      });
    });
  });

  describe('동일한 username을 가진 계정이 있는 경우', () => {
    beforeEach(async () => {
      await accountRepository.insert(
        AccountFactory.build({ username: command.username }),
      );
    });
    describe('계정을 생성하면', () => {
      it('이미 username을 사용중이란 에러가 발생한다.', async () => {
        await expect(service.execute(command)).rejects.toThrow(
          AccountUsernameAlreadyOccupiedError,
        );
      });
    });
  });
});
