import { faker } from '@faker-js/faker';

import {
  AccountSnsLink,
  AccountSnsLinkProps,
} from '@module/account/entities/account-sns-link.vo';
import { AccountValidationError } from '@module/account/errors/account-validation.error';
import { AccountCreatedEvent } from '@module/account/events/account-created.event';
import { AccountUpdatedEvent } from '@module/account/events/account-updated.event';

import {
  AggregateRoot,
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
  profileImagePath?: string;
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
  profileImagePath?: string;
  positionNames?: string[];
  techStackNames?: string[];
  snsLinks?: AccountSnsLinkProps[];
}

export class Account extends AggregateRoot<AccountProps> {
  static USERNAME_MAX_LENGTH = 20;
  static NAME_MAX_LENGTH = 10;

  constructor(props: CreateEntityProps<AccountProps>) {
    super(props);
  }

  static createByUsername(
    createAccountByUsernameProps: CreateAccountByUsernameProps,
  ): Account {
    const id = generateEntityId();
    const date = new Date();

    const account = new Account({
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

    account.apply(
      new AccountCreatedEvent(id, {
        username: createAccountByUsernameProps.username,
        password: createAccountByUsernameProps.password,
        signInType: SignInType.Username,
        role: AccountRole.User,
        name: createAccountByUsernameProps.name ?? this.generateRandomName(),
        positionNames: [],
        techStackNames: [],
        snsLinks: [],
      }),
    );

    return account;
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

  get profileImageUrl() {
    if (this.props.profileImagePath === undefined) {
      return undefined;
    }

    return `${process.env.AWS_S3_URL}/${this.props.profileImagePath}`;
  }
  set profileImagePath(value: string) {
    this.props.profileImagePath = value;
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
      this.validateName();
    }
    if (updateAccountProps.introduce !== undefined) {
      this.props.introduce = updateAccountProps.introduce;
    }
    if (updateAccountProps.profileImagePath !== undefined) {
      this.props.profileImagePath = updateAccountProps.profileImagePath;
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

    this.apply(
      new AccountUpdatedEvent(this.id, {
        name: updateAccountProps.name,
        introduce: updateAccountProps.introduce,
        profileImagePath: updateAccountProps.profileImagePath,
        positionNames: updateAccountProps.positionNames,
        techStackNames: updateAccountProps.techStackNames,
        snsLinks: updateAccountProps.snsLinks,
      }),
    );

    return this;
  }

  public validate(): void {
    this.validateName();
    this.validateUsername();
  }

  private validateName() {
    if (
      this.props.name !== undefined &&
      this.props.name.length > Account.NAME_MAX_LENGTH
    ) {
      throw new AccountValidationError(
        'Account name can not be longer than 10 characters',
      );
    }
  }

  private validateUsername() {
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
