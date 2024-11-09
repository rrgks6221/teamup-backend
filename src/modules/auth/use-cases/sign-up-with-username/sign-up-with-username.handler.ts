import { Inject } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Account, SignInType } from '@module/account/entities/account.entity';
import { CreateAccountCommand } from '@module/account/use-cases/create-account/create-account.command';
import { AuthToken } from '@module/auth/entities/auth-token.vo';
import {
  AUTH_TOKEN_SERVICE,
  IAuthTokenService,
} from '@module/auth/services/auth-token/auth-token.service.interface';
import { SignUpWithUsernameCommand } from '@module/auth/use-cases/sign-up-with-username/sign-up-with-username.command';

@CommandHandler(SignUpWithUsernameCommand)
export class SignUpWithUsernameHandler
  implements ICommandHandler<SignUpWithUsernameCommand, AuthToken>
{
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(AUTH_TOKEN_SERVICE)
    private readonly authService: IAuthTokenService,
  ) {}

  async execute(command: SignUpWithUsernameCommand): Promise<AuthToken> {
    const createAccountCommand = new CreateAccountCommand({
      username: command.username,
      password: command.password,
      signInType: SignInType.Username,
    });

    const account = await this.commandBus.execute<
      CreateAccountCommand,
      Account
    >(createAccountCommand);

    const authToken = await this.authService.generateAuthToken(account);

    return authToken;
  }
}
