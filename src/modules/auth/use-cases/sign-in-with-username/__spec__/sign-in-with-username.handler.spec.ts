import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import bcrypt from 'bcrypt';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { SignInType } from '@module/account/entities/account.entity';
import { GetAccountByUsernameQuery } from '@module/account/use-cases/get-account-by-username/get-account-by-username.query';
import { AuthToken } from '@module/auth/entities/auth-token.vo';
import { SignInInfoNotMatchedError } from '@module/auth/errors/sign-in-info-not-matched.error';
import { AuthTokenModule } from '@module/auth/services/auth-token/auth-token.module';
import { SignInWithUsernameCommandFactory } from '@module/auth/use-cases/sign-in-with-username/__spec__/sign-in-with-username.command.factory';
import { SignInWithUsernameCommand } from '@module/auth/use-cases/sign-in-with-username/sign-in-with-username.command';
import { SignInWithUsernameHandler } from '@module/auth/use-cases/sign-in-with-username/sign-in-with-username.handler';

describe(SignInWithUsernameHandler.name, () => {
  let handler: SignInWithUsernameHandler;

  let queryBus: QueryBus;

  let command: SignInWithUsernameCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule, AuthTokenModule],
      providers: [SignInWithUsernameHandler],
    }).compile();

    handler = module.get<SignInWithUsernameHandler>(SignInWithUsernameHandler);

    queryBus = module.get<QueryBus>(QueryBus);
  });

  beforeEach(() => {
    command = SignInWithUsernameCommandFactory.build();
  });

  describe('username에 해당하는 계정이 존재하고', () => {
    beforeEach(() => {
      jest
        .spyOn(queryBus, 'execute')
        .mockImplementation((query: GetAccountByUsernameQuery) =>
          Promise.resolve(
            AccountFactory.build({
              username: query.username,
              signInType: SignInType.Username,
            }),
          ),
        );
    });

    describe('비밀번호가 일치하는 경우', () => {
      beforeEach(() => {
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      });

      describe('로그인을 하면', () => {
        it('토큰을 반환한다.', async () => {
          await expect(handler.execute(command)).resolves.toBeInstanceOf(
            AuthToken,
          );
        });
      });
    });

    describe('비밀번호가 일치하지 않는 경우', () => {
      beforeEach(() => {
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      });

      describe('로그인을 하면', () => {
        it('로그인 정보가 일치하지 않는다는 에러가 발생한다.', async () => {
          await expect(handler.execute(command)).rejects.toThrow(
            SignInInfoNotMatchedError,
          );
        });
      });
    });
  });

  describe('username에 해당하는 계정이 존재하지 않는 경우', () => {
    beforeEach(() => {
      jest
        .spyOn(queryBus, 'execute')
        .mockImplementation(() => Promise.reject(new Error()));
    });

    describe('로그인을 하면', () => {
      it('로그인 정보가 일치하지 않는다는 에러가 발생한다.', async () => {
        await expect(handler.execute(command)).rejects.toThrow(
          SignInInfoNotMatchedError,
        );
      });
    });
  });
});
