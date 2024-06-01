import { SignInType } from '@module/account/entities/account.entity';
import { AuthToken } from '@module/auth/entities/auth-token.vo';

import { IBaseService } from '@common/base/base-service';

export const SIGN_IN_WITH_USERNAME_SERVICE = Symbol(
  'ISignInWithUsernameService',
);

export interface ISignInWithUsernameCommandProps {
  username: string;
  password: string;
}

export class SignInWithUsernameCommand {
  readonly username: string;
  readonly password: string;
  readonly signInType: SignInType.Username;

  constructor(props: ISignInWithUsernameCommandProps) {
    this.username = props.username;
    this.password = props.password;
    this.signInType = SignInType.Username;
  }
}

export interface ISignInWithUsernameService
  extends IBaseService<SignInWithUsernameCommand, AuthToken> {}
