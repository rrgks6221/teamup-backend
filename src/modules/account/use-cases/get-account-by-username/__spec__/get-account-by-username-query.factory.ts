import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { Account } from '@module/account/entities/account.entity';
import { GetAccountByUsernameQuery } from '@module/account/use-cases/get-account-by-username/get-account-by-username.service.interface';

export const GetAccountByUsernameQueryFactory =
  Factory.define<GetAccountByUsernameQuery>(
    'GetAccountByUsernameQuery',
    GetAccountByUsernameQuery,
  ).attrs({
    username: () => faker.string.nanoid(Account.USERNAME_MAX_LENGTH),
  });
