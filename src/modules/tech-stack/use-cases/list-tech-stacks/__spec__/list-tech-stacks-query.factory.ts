import { Factory } from 'rosie';

import { ListTechStacksQuery } from '@module/tech-stack/use-cases/list-tech-stacks/list-tech-stacks.query';

export const ListTechStacksQueryFactory = Factory.define<ListTechStacksQuery>(
  ListTechStacksQuery.name,
  ListTechStacksQuery,
).attrs({});
