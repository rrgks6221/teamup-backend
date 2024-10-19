import { faker } from '@faker-js/faker';

import {
  AccountSnsLink,
  AccountSnsLinkProps,
} from '@module/account/entities/account-sns-link.vo';
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
  name: string;
  introduce?: string;
  positionNames: string[];
  techStackNames: string[];
  snsLinks: AccountSnsLink[];
}

interface CreateAccountByUsernameProps {
  username: string;
  password: string;
  signInType: SignInType.Username;
  name?: string;
}

interface UpdateAccountProps {
  name?: string;
  introduce?: string;
  positionNames?: string[];
  techStackNames?: string[];
  snsLinks?: AccountSnsLinkProps[];
}

export class Account extends BaseEntity<AccountProps> {
  static USERNAME_MAX_LENGTH = 20;
  static NAME_MAX_LENGTH = 10;

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
        name: createAccountByUsernameProps.name ?? this.generateRandomName(),
        positionNames: [],
        techStackNames: [],
        snsLinks: [],
      },
      createdAt: date,
      updatedAt: date,
    });
  }

  // @todo 의미있는 닉네임을 생성
  private static generateRandomName() {
    return faker.string.nanoid(Account.NAME_MAX_LENGTH);
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

  get name() {
    return this.props.name;
  }

  get introduce() {
    return this.props.introduce;
  }

  get positionNames() {
    return this.props.positionNames;
  }

  get techStackNames() {
    return this.props.techStackNames;
  }

  get snsLinks() {
    return this.props.snsLinks;
  }

  update(updateAccountProps: UpdateAccountProps) {
    if (updateAccountProps.name !== undefined) {
      this.props.name = updateAccountProps.name;
      this.nameValidate();
    }
    if (updateAccountProps.introduce !== undefined) {
      this.props.introduce = updateAccountProps.introduce;
    }
    if (updateAccountProps.positionNames !== undefined) {
      this.props.positionNames = updateAccountProps.positionNames;
    }
    if (updateAccountProps.techStackNames !== undefined) {
      this.props.techStackNames = updateAccountProps.techStackNames;
    }
    if (updateAccountProps.snsLinks !== undefined) {
      this.props.snsLinks = updateAccountProps.snsLinks.map(
        (snsLink) =>
          new AccountSnsLink({
            url: snsLink.url,
            platform: snsLink.platform,
            visibilityScope: snsLink.visibilityScope,
          }),
      );
    }

    return this;
  }

  public validate(): void {
    this.nameValidate();
    this.usernameValidate();
  }

  private nameValidate() {
    if (
      this.props.name !== undefined &&
      this.props.name.length > Account.NAME_MAX_LENGTH
    ) {
      throw new AccountValidationError(
        'Account name can not be longer than 10 characters',
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
