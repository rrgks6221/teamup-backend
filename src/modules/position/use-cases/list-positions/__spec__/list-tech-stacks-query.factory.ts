import { Factory } from 'rosie';

import { ListPositionsQuery } from '@module/position/use-cases/list-positions/list-positions.query';

export const ListPositionsQueryFactory = Factory.define<ListPositionsQuery>(
  ListPositionsQuery.name,
  ListPositionsQuery,
).attrs({});
