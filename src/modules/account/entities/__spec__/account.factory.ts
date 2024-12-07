import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import {
  Account,
  AccountProps,
  SignInType,
} from '@module/account/entities/account.entity';

import { generateEntityId } from '@common/base/base.entity';

export const AccountFactory = Factory.define<Account & AccountProps>('Account')
  .attrs({
    id: () => generateEntityId(),
    signInType: () => faker.helpers.enumValue(SignInType),
    username: () => faker.string.nanoid(Account.USERNAME_MAX_LENGTH),
    password: () => faker.string.uuid(),
    nickname: () => faker.string.nanoid(Account.NICKNAME_MAX_LENGTH),
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
  })
  .after(
    ({ id, createdAt, updatedAt, ...props }) =>
      new Account({ id, createdAt, updatedAt, props }),
  );
