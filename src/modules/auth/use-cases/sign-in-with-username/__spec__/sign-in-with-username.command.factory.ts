import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { Account, SignInType } from '@module/account/entities/account.entity';
import { SignUpWithUsernameCommand } from '@module/auth/use-cases/sign-up-with-username/sign-up-with-username.service.interface';

export const SignInWithUsernameCommandFactory =
  Factory.define<SignUpWithUsernameCommand>('SignInWithUsernameCommand').attrs({
    username: () => faker.string.nanoid(Account.USERNAME_MAX_LENGTH),
    password: () => faker.string.uuid(),
    signInType: SignInType.Username,
  });
