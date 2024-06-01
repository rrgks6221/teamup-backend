import { Inject, Injectable } from '@nestjs/common';

import bcrypt from 'bcrypt';

import { SignInType } from '@module/account/entities/account.entity';
import {
  GET_ACCOUNT_BY_USERNAME_SERVICE,
  GetAccountByUsernameQuery,
  IGetAccountByUsernameService,
} from '@module/account/use-cases/get-account-by-username/get-account-by-username.service.interface';
import { AuthToken } from '@module/auth/entities/auth-token.vo';
import { SignInInfoNotMatchedError } from '@module/auth/errors/sign-in-info-not-matched.error';
import {
  AUTH_TOKEN_SERVICE,
  IAuthTokenService,
} from '@module/auth/services/auth-token/auth-token.service.interface';
import {
  ISignInWithUsernameService,
  SignInWithUsernameCommand,
} from '@module/auth/use-cases/sign-in-with-username/sign-in-with-username.service.interface';

@Injectable()
export class SignInWithUsernameService implements ISignInWithUsernameService {
  constructor(
    @Inject(GET_ACCOUNT_BY_USERNAME_SERVICE)
    private readonly getAccountByUsernameService: IGetAccountByUsernameService,
    @Inject(AUTH_TOKEN_SERVICE)
    private readonly authService: IAuthTokenService,
  ) {}

  async execute(command: SignInWithUsernameCommand): Promise<AuthToken> {
    const getAccountByUsernameQuery = new GetAccountByUsernameQuery({
      username: command.username,
    });

    const account = await this.getAccountByUsernameService
      .execute(getAccountByUsernameQuery)
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
