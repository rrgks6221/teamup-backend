import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { Account } from '@module/account/entities/account.entity';
import { GetAccountByUsernameQuery } from '@module/account/use-cases/get-account-by-username/get-account-by-username.query';

export const GetAccountByUsernameQueryFactory =
  Factory.define<GetAccountByUsernameQuery>(
    GetAccountByUsernameQuery.name,
    GetAccountByUsernameQuery,
  ).attrs({
    username: () => faker.string.nanoid(Account.USERNAME_MAX_LENGTH),
  });
