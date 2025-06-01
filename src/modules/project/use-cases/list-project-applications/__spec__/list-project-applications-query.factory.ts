import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { ProjectApplicationStatus } from '@module/project/entities/project-application.entity';
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
    statuses: () =>
      faker.helpers.arrayElements(Object.values(ProjectApplicationStatus)),
  });
