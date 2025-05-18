import { Factory } from 'rosie';

import { ListProjectApplicationsQuery } from '@module/project/use-cases/list-project-applications/list-project-applications.query';

import { generateEntityId } from '@common/base/base.entity';

export const ListProjectApplicationsQueryFactory =
  Factory.define<ListProjectApplicationsQuery>(
    ListProjectApplicationsQuery.name,
    ListProjectApplicationsQuery,
  ).attrs({
    currentUserId: () => generateEntityId(),
    projectId: () => generateEntityId(),
    cursor: () => undefined,
    limit: () => 20,
  });
