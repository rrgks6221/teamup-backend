import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { Account, SignInType } from '@module/account/entities/account.entity';
import { CreateAccountCommand } from '@module/account/use-cases/create-account/create-account.service.interface';

export const CreateAccountCommandFactory = Factory.define<CreateAccountCommand>(
  'CreateAccountCommand',
  CreateAccountCommand,
).attrs({
  username: () => faker.string.nanoid(Account.USERNAME_MAX_LENGTH),
  password: () => faker.string.uuid(),
  signInType: () => faker.helpers.enumValue(SignInType),
  nickname: () => faker.string.nanoid(Account.NICKNAME_MAX_LENGTH),
});
