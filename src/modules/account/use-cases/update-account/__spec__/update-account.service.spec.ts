import { Test, TestingModule } from '@nestjs/testing';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { AccountNicknameAlreadyOccupiedError } from '@module/account/errors/account-nickname-already-occupied.error';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { UpdateAccountCommandFactory } from '@module/account/use-cases/update-account/__spec__/update-account-command.factory';
import { UpdateAccountModule } from '@module/account/use-cases/update-account/update-account.module';
import { UpdateAccountService } from '@module/account/use-cases/update-account/update-account.service';
import {
  IUpdateAccountService,
  UPDATE_ACCOUNT_SERVICE,
  UpdateAccountCommand,
} from '@module/account/use-cases/update-account/update-account.service.interface';

describe(UpdateAccountService.name, () => {
  let service: IUpdateAccountService;

  let accountRepository: AccountRepositoryPort;

  let command: UpdateAccountCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UpdateAccountModule],
    }).compile();

    service = module.get<IUpdateAccountService>(UPDATE_ACCOUNT_SERVICE);

    accountRepository = module.get<AccountRepositoryPort>(ACCOUNT_REPOSITORY);
  });

  beforeEach(() => {
    command = UpdateAccountCommandFactory.build();
  });

  describe('식별자와 일치하는 계정이 존재하고', () => {
    beforeEach(async () => {
      await accountRepository.insert(
        AccountFactory.build({ id: command.accountId }),
      );
    });

    describe('계정을 업데이트하면', () => {
      it('계정이 업데이트 된다.', async () => {
        await expect(service.execute(command)).resolves.toEqual(
          expect.objectContaining({
            id: command.accountId,
            nickname: command.nickname,
          }),
        );
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

  describe('식별자와 일치하는 계정이 존재하지 않는 경우', () => {
    describe('계정을 업데이트하면', () => {
      it('계정이 존재하지 않는다는 에러가 발생한다.', async () => {
        await expect(service.execute(command)).rejects.toThrow(
          AccountNotFoundError,
        );
      });
    });
  });
});
