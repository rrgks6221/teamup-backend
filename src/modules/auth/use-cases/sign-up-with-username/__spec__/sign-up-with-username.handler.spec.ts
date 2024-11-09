import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { CreateAccountCommand } from '@module/account/use-cases/create-account/create-account.command';
import { AuthToken } from '@module/auth/entities/auth-token.vo';
import { AuthTokenModule } from '@module/auth/services/auth-token/auth-token.module';
import { SignUpWithUsernameCommandFactory } from '@module/auth/use-cases/sign-up-with-username/__spec__/sign-up-with-username.command.factory';
import { SignUpWithUsernameCommand } from '@module/auth/use-cases/sign-up-with-username/sign-up-with-username.command';
import { SignUpWithUsernameHandler } from '@module/auth/use-cases/sign-up-with-username/sign-up-with-username.handler';

describe(SignUpWithUsernameHandler.name, () => {
  let handler: SignUpWithUsernameHandler;

  let commandBus: CommandBus;

  let command: SignUpWithUsernameCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthTokenModule, CqrsModule],
      providers: [SignUpWithUsernameHandler],
    }).compile();

    handler = module.get<SignUpWithUsernameHandler>(SignUpWithUsernameHandler);

    commandBus = module.get<CommandBus>(CommandBus);
  });

  beforeEach(() => {
    jest.spyOn(commandBus, 'execute').mockResolvedValue(AccountFactory.build());
  });

  beforeEach(() => {
    command = SignUpWithUsernameCommandFactory.build();
  });

  describe('회원가입을 하면', () => {
    it('계정을 생성하고 토큰을 반환한다.', async () => {
      await expect(handler.execute(command)).resolves.toBeInstanceOf(AuthToken);

      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(CreateAccountCommand),
      );
    });
  });
});
