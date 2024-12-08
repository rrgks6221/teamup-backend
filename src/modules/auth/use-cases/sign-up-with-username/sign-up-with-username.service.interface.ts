import { SignInType } from '@module/account/entities/account.entity';
import { AuthToken } from '@module/auth/entities/auth-token.vo';

import { IBaseService } from '@common/base/base-service';

export const SIGN_UP_WITH_USERNAME_SERVICE = Symbol(
  'ISignUpWithUsernameService',
);

export interface ISignUpWithUsernameCommandProps {
  username: string;
  password: string;
}

export class SignUpWithUsernameCommand {
  readonly username: string;
  readonly password: string;
  readonly signInType: SignInType.Username;

  constructor(props: ISignUpWithUsernameCommandProps) {
    this.username = props.username;
    this.password = props.password;
    this.signInType = SignInType.Username;
  }
}

export interface ISignUpWithUsernameService
  extends IBaseService<SignUpWithUsernameCommand, AuthToken> {}
