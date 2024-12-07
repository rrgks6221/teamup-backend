import { Factory } from 'rosie';

import { GetAccountQuery } from '@module/account/use-cases/get-account/get-account.service.interface';

import { generateEntityId } from '@common/base/base.entity';

export const GetAccountQueryFactory = Factory.define<GetAccountQuery>(
  'GetAccountQuery',
  GetAccountQuery,
).attrs({
  id: () => generateEntityId(),
});
