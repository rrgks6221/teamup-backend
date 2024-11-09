import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { Account, SignInType } from '@module/account/entities/account.entity';
import { SignInWithUsernameCommand } from '@module/auth/use-cases/sign-in-with-username/sign-in-with-username.command';

export const SignInWithUsernameCommandFactory =
  Factory.define<SignInWithUsernameCommand>(
    SignInWithUsernameCommand.name,
  ).attrs({
    username: () => faker.string.nanoid(Account.USERNAME_MAX_LENGTH),
    password: () => faker.string.uuid(),
    signInType: SignInType.Username,
  });
