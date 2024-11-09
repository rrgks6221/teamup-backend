import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { Account, SignInType } from '@module/account/entities/account.entity';
import { CreateAccountCommand } from '@module/account/use-cases/create-account/create-account.command';

export const CreateAccountCommandFactory = Factory.define<CreateAccountCommand>(
  CreateAccountCommand.name,
  CreateAccountCommand,
).attrs({
  username: () => faker.string.nanoid(Account.USERNAME_MAX_LENGTH),
  password: () => faker.string.uuid(),
  signInType: () => faker.helpers.enumValue(SignInType),
  name: () => faker.string.nanoid(Account.NAME_MAX_LENGTH),
});
