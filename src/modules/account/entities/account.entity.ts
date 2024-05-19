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

export interface AccountProps {
  username?: string;
  password?: string;
  signInType: SignInType;
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
    }

    return this;
  }

  public validate(): void {
    if (this.props.nickname !== undefined) {
      if (this.props.nickname.length > Account.NICKNAME_MAX_LENGTH) {
        throw new AccountValidationError(
          'account nickname can not be longer than 20 characters',
        );
      }
    }
  }
}
