import { faker } from '@faker-js/faker';

import { AccountValidationError } from '@module/account/errors/account-validation.error';

import {
  BaseEntity,
  CreateEntityProps,
  generateEntityId,
} from '@common/base/base.entity';

export enum SignInType {
  Username = 'Username',
}

export enum AccountRole {
  Admin = 'Admin',
  User = 'User',
}

export interface AccountProps {
  username?: string;
  password?: string;
  signInType: SignInType;
  role: AccountRole;
  nickname: string;
}

interface CreateAccountByUsernameProps {
  username: string;
  password: string;
  signInType: SignInType.Username;
  nickname?: string;
}

interface UpdateAccountProps {
  nickname?: string;
}

export class Account extends BaseEntity<AccountProps> {
  static USERNAME_MAX_LENGTH = 20;
  static NICKNAME_MAX_LENGTH = 10;

  constructor(props: CreateEntityProps<AccountProps>) {
    super(props);
  }

  static createByUsername(
    createAccountByUsernameProps: CreateAccountByUsernameProps,
  ) {
    const id = generateEntityId();
    const date = new Date();

    return new Account({
      id,
      props: {
        username: createAccountByUsernameProps.username,
        password: createAccountByUsernameProps.password,
        signInType: createAccountByUsernameProps.signInType,
        role: AccountRole.User,
        nickname:
          createAccountByUsernameProps.nickname ??
          this.generateRandomNickname(),
      },
      createdAt: date,
      updatedAt: date,
    });
  }

  // @todo 의미있는 닉네임을 생성
  private static generateRandomNickname() {
    return faker.string.nanoid(Account.NICKNAME_MAX_LENGTH);
  }

  get username() {
    return this.props.username;
  }

  get password() {
    return this.props.password;
  }

  get signInType() {
    return this.props.signInType;
  }

  get role() {
    return this.props.role;
  }

  get nickname() {
    return this.props.nickname;
  }

  isSameNicknameAccount(compareAccount: Account) {
    if (this.id === compareAccount.id) {
      return false;
    }

    return this.props.nickname === compareAccount.nickname;
  }

  update(updateAccountProps: UpdateAccountProps) {
    if (updateAccountProps.nickname !== undefined) {
      this.props.nickname = updateAccountProps.nickname;
      this.nicknameValidate();
    }

    return this;
  }

  public validate(): void {
    this.nicknameValidate();
    this.usernameValidate();
  }

  private nicknameValidate() {
    if (
      this.props.nickname !== undefined &&
      this.props.nickname.length > Account.NICKNAME_MAX_LENGTH
    ) {
      throw new AccountValidationError(
        'Account nickname can not be longer than 10 characters',
      );
    }
  }

  private usernameValidate() {
    if (
      this.props.username !== undefined &&
      this.props.username.length > Account.USERNAME_MAX_LENGTH
    ) {
      throw new AccountValidationError(
        'Account username can not be longer than 20 characters',
      );
    }
  }
}
