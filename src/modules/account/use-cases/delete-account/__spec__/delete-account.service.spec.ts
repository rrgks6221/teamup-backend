import { Test, TestingModule } from '@nestjs/testing';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { DeleteAccountCommandFactory } from '@module/account/use-cases/delete-account/__spec__/delete-account-command.factory';
import { DeleteAccountModule } from '@module/account/use-cases/delete-account/delete-account.module';
import { DeleteAccountService } from '@module/account/use-cases/delete-account/delete-account.service';
import {
  DELETE_ACCOUNT_SERVICE,
  DeleteAccountCommand,
  IDeleteAccountService,
} from '@module/account/use-cases/delete-account/delete-account.service.interface';

describe(DeleteAccountService.name, () => {
  let service: IDeleteAccountService;

  let accountRepository: AccountRepositoryPort;

  let command: DeleteAccountCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DeleteAccountModule],
    }).compile();

    service = module.get<IDeleteAccountService>(DELETE_ACCOUNT_SERVICE);

    accountRepository = module.get<AccountRepositoryPort>(ACCOUNT_REPOSITORY);
  });

  beforeEach(() => {
    command = DeleteAccountCommandFactory.build();
  });

  describe('식별자와 일치하는 계정이 존재하는 경우', () => {
    beforeEach(async () => {
      await accountRepository.insert(AccountFactory.build({ id: command.id }));
    });

    describe('계정을 삭제하면', () => {
      it('계정이 삭제된다.', async () => {
        await expect(service.execute(command)).resolves.toBeUndefined();
        await expect(
          accountRepository.findOneById(command.id),
        ).resolves.toBeUndefined();
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
