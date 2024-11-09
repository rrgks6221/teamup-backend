import { ICommand } from '@nestjs/cqrs';

import { SignInType } from '@module/account/entities/account.entity';

export interface ISignUpWithUsernameCommandProps {
  username: string;
  password: string;
}

export class SignUpWithUsernameCommand implements ICommand {
  readonly username: string;
  readonly password: string;
  readonly signInType: SignInType.Username;

  constructor(props: ISignUpWithUsernameCommandProps) {
    this.username = props.username;
    this.password = props.password;
    this.signInType = SignInType.Username;
  }
}
