import { ICommand } from '@nestjs/cqrs';

import { SignInType } from '@module/account/entities/account.entity';

export interface ICreateAccountCommandProps {
  username: string;
  password: string;
  signInType: SignInType;
  name?: string;
}

export class CreateAccountCommand implements ICommand {
  readonly username: string;
  readonly password: string;
  readonly signInType: SignInType;
  readonly name?: string;

  constructor(props: ICreateAccountCommandProps) {
    this.username = props.username;
    this.password = props.password;
    this.signInType = props.signInType;
    this.name = props.name;
  }
}
