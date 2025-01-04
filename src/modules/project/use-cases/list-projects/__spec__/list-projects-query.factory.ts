import { Factory } from 'rosie';

import { ListProjectsQuery } from '@module/project/use-cases/list-projects/list-projects.query';

export const ListProjectsQueryFactory = Factory.define<ListProjectsQuery>(
  ListProjectsQuery.name,
  ListProjectsQuery,
).attrs({
  cursor: () => undefined,
  limit: () => 20,
  statuses: () => undefined,
});
