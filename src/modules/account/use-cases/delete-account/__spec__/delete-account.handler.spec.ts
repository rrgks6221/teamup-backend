import { Test, TestingModule } from '@nestjs/testing';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { DeleteAccountCommandFactory } from '@module/account/use-cases/delete-account/__spec__/delete-account-command.factory';
import { DeleteAccountCommand } from '@module/account/use-cases/delete-account/delete-account.command';
import { DeleteAccountHandler } from '@module/account/use-cases/delete-account/delete-account.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(DeleteAccountHandler.name, () => {
  let handler: DeleteAccountHandler;

  let accountRepository: AccountRepositoryPort;

  let command: DeleteAccountCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AccountRepositoryModule, EventStoreModule],
      providers: [DeleteAccountHandler],
    }).compile();

    handler = module.get<DeleteAccountHandler>(DeleteAccountHandler);

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
        await expect(handler.execute(command)).resolves.toBeUndefined();
        await expect(
          accountRepository.findOneById(command.id),
        ).resolves.toBeUndefined();
      });
    });
  });

  describe('식별자와 일치하는 계정이 존재하지 않는 경우', () => {
    describe('계정을 업데이트하면', () => {
      it('계정이 존재하지 않는다는 에러가 발생한다.', async () => {
        await expect(handler.execute(command)).rejects.toThrow(
          AccountNotFoundError,
        );
      });
    });
  });
});
