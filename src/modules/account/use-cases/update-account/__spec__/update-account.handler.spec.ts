import { Test, TestingModule } from '@nestjs/testing';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { UpdateAccountCommandFactory } from '@module/account/use-cases/update-account/__spec__/update-account-command.factory';
import { UpdateAccountCommand } from '@module/account/use-cases/update-account/update-account.command';
import { UpdateAccountHandler } from '@module/account/use-cases/update-account/update-account.handler';
import { PositionServiceModule } from '@module/position/services/position-service/position-service.module';
import { TechStackServiceModule } from '@module/tech-stack/services/tech-stack-service/tech-stack-service.module';

describe(UpdateAccountHandler.name, () => {
  let handler: UpdateAccountHandler;

  let accountRepository: AccountRepositoryPort;

  let command: UpdateAccountCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AccountRepositoryModule,
        PositionServiceModule,
        TechStackServiceModule,
      ],
      providers: [UpdateAccountHandler],
    }).compile();

    handler = module.get<UpdateAccountHandler>(UpdateAccountHandler);

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
        await expect(handler.execute(command)).resolves.toEqual(
          expect.objectContaining({
            id: command.accountId,
            name: command.name,
            introduce: command.introduce,
            profileImageUrl: expect.stringContaining(
              command.profileImagePath as string,
            ),
            positionNames: [],
            techStackNames: [],
            snsLinks: [],
          }),
        );
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
