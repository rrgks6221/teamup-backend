import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';

import bcrypt from 'bcrypt';

import { Account, SignInType } from '@module/account/entities/account.entity';
import { GetAccountByUsernameQuery } from '@module/account/use-cases/get-account-by-username/get-account-by-username.query';
import { AuthToken } from '@module/auth/entities/auth-token.vo';
import { SignInInfoNotMatchedError } from '@module/auth/errors/sign-in-info-not-matched.error';
import {
  AUTH_TOKEN_SERVICE,
  IAuthTokenService,
} from '@module/auth/services/auth-token/auth-token.service.interface';
import { SignInWithUsernameCommand } from '@module/auth/use-cases/sign-in-with-username/sign-in-with-username.command';

@CommandHandler(SignInWithUsernameCommand)
export class SignInWithUsernameHandler
  implements ICommandHandler<SignInWithUsernameCommand, AuthToken>
{
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(AUTH_TOKEN_SERVICE)
    private readonly authService: IAuthTokenService,
  ) {}

  async execute(command: SignInWithUsernameCommand): Promise<AuthToken> {
    const getAccountByUsernameQuery = new GetAccountByUsernameQuery({
      username: command.username,
    });

    const account = await this.queryBus
      .execute<GetAccountByUsernameQuery, Account>(getAccountByUsernameQuery)
      .catch(() => {
        throw new SignInInfoNotMatchedError();
      });

    if (account.signInType !== SignInType.Username) {
      throw new SignInInfoNotMatchedError();
    }

    const isPasswordMatch = await bcrypt.compare(
      command.password,
      account.password as string,
    );

    if (!isPasswordMatch) {
      throw new SignInInfoNotMatchedError();
    }

    const authToken = await this.authService.generateAuthToken(account);

    return authToken;
  }
}
