import { Inject, Injectable } from '@nestjs/common';

import bcrypt from 'bcrypt';

import { SignInType } from '@module/account/entities/account.entity';
import {
  CREATE_ACCOUNT_SERVICE,
  CreateAccountCommand,
  ICreateAccountService,
} from '@module/account/use-cases/create-account/create-account.service.interface';
import { AuthToken } from '@module/auth/entities/auth-token.vo';
import {
  AUTH_TOKEN_SERVICE,
  IAuthTokenService,
} from '@module/auth/services/auth-token/auth-token.service.interface';
import {
  ISignUpWithUsernameService,
  SignUpWithUsernameCommand,
} from '@module/auth/use-cases/sign-up-with-username/sign-up-with-username.service.interface';

@Injectable()
export class SignUpWithUsernameService implements ISignUpWithUsernameService {
  constructor(
    @Inject(CREATE_ACCOUNT_SERVICE)
    private readonly createAccountService: ICreateAccountService,
    @Inject(AUTH_TOKEN_SERVICE)
    private readonly authService: IAuthTokenService,
  ) {}

  async execute(command: SignUpWithUsernameCommand): Promise<AuthToken> {
    const createAccountCommand = new CreateAccountCommand({
      username: command.username,
      password: await bcrypt.hash(command.password, 10),
      signInType: SignInType.Username,
    });

    const account =
      await this.createAccountService.execute(createAccountCommand);

    const authToken = await this.authService.generateAuthToken(account);

    return authToken;
  }
}
