import { Account, SignInType } from '@module/account/entities/account.entity';

import { IBaseService } from '@common/base/base-service';

export const CREATE_ACCOUNT_SERVICE = Symbol('ICreateAccountService');

export interface ICreateAccountCommandProps {
  username: string;
  password: string;
  signInType: SignInType;
  nickname?: string;
}

export class CreateAccountCommand {
  readonly username: string;
  readonly password: string;
  readonly signInType: SignInType;
  readonly nickname?: string;

  constructor(props: ICreateAccountCommandProps) {
    this.username = props.username;
    this.password = props.password;
    this.signInType = props.signInType;
    this.nickname = props.nickname;
  }
}

export interface ICreateAccountService
  extends IBaseService<CreateAccountCommand, Account> {}
