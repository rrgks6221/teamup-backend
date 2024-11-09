import { ICommand } from '@nestjs/cqrs';

import { SignInType } from '@module/account/entities/account.entity';

export interface ISignInWithUsernameCommandProps {
  username: string;
  password: string;
}

export class SignInWithUsernameCommand implements ICommand {
  readonly username: string;
  readonly password: string;
  readonly signInType: SignInType.Username;

  constructor(props: ISignInWithUsernameCommandProps) {
    this.username = props.username;
    this.password = props.password;
    this.signInType = SignInType.Username;
  }
}
