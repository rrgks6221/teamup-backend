import { Factory } from 'rosie';

import { GetCurrentAccountQuery } from '@module/account/use-cases/get-current-account/get-current-account.service.interface';

export const GetCurrentAccountQueryFactory =
  Factory.define<GetCurrentAccountQuery>(
    'GetCurrentAccountQuery',
    GetCurrentAccountQuery,
  ).attrs({});
