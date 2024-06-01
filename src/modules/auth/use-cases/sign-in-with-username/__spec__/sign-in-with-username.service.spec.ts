import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { CreateAccountCommandFactory } from '@module/account/use-cases/create-account/__spec__/create-account.command.factory';
import {
  CREATE_ACCOUNT_SERVICE,
  ICreateAccountService,
} from '@module/account/use-cases/create-account/create-account.service.interface';
import { AuthToken } from '@module/auth/entities/auth-token.vo';
import { SignInInfoNotMatchedError } from '@module/auth/errors/sign-in-info-not-matched.error';
import { SignInWithUsernameCommandFactory } from '@module/auth/use-cases/sign-in-with-username/__spec__/sign-in-with-username.command.factory';
import { SignInWithUsernameModule } from '@module/auth/use-cases/sign-in-with-username/sign-in-with-username.module';
import { SignInWithUsernameService } from '@module/auth/use-cases/sign-in-with-username/sign-in-with-username.service';
import {
  ISignInWithUsernameService,
  SIGN_IN_WITH_USERNAME_SERVICE,
  SignInWithUsernameCommand,
} from '@module/auth/use-cases/sign-in-with-username/sign-in-with-username.service.interface';

describe(SignInWithUsernameService.name, () => {
  let service: ISignInWithUsernameService;

  let createAccountService: ICreateAccountService;

  let command: SignInWithUsernameCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SignInWithUsernameModule],
    }).compile();

    service = module.get<ISignInWithUsernameService>(
      SIGN_IN_WITH_USERNAME_SERVICE,
    );
    createAccountService = module.get<ICreateAccountService>(
      CREATE_ACCOUNT_SERVICE,
    );
  });

  beforeEach(() => {
    command = SignInWithUsernameCommandFactory.build();
  });

  describe('username에 해당하는 계정이 존재하고', () => {
    beforeEach(async () => {
      const createAccountCommand = CreateAccountCommandFactory.build({
        username: command.username,
        password: command.password,
        signInType: command.signInType,
      });
      await createAccountService.execute(createAccountCommand);
    });

    describe('비밀번호가 일치하는 경우', () => {
      beforeEach(() => {});
      describe('로그인을 하면', () => {
        it('토큰을 반환한다.', async () => {
          await expect(service.execute(command)).resolves.toBeInstanceOf(
            AuthToken,
          );
        });
      });
    });

    describe('비밀번호가 일치하지 않는 경우', () => {
      beforeEach(() => {
        command = SignInWithUsernameCommandFactory.build({
          password: faker.string.nanoid(),
        });
      });

      describe('로그인을 하면', () => {
        it('로그인 정보가 일치하지 않는다는 에러가 발생한다.', async () => {
          await expect(service.execute(command)).rejects.toThrow(
            SignInInfoNotMatchedError,
          );
        });
      });
    });
  });

  describe('username에 해당하는 계정이 존재하지 않는 경우', () => {
    describe('로그인을 하면', () => {
      it('로그인 정보가 일치하지 않는다는 에러가 발생한다.', async () => {
        await expect(service.execute(command)).rejects.toThrow(
          SignInInfoNotMatchedError,
        );
      });
    });
  });
});
