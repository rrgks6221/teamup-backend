import { Factory } from 'rosie';

import { ListProjectMembersQuery } from '@module/project/use-cases/list-project-members/list-project-members.query';

import { generateEntityId } from '@common/base/base.entity';

export const ListProjectMembersQueryFactory =
  Factory.define<ListProjectMembersQuery>(
    ListProjectMembersQuery.name,
    ListProjectMembersQuery,
  ).attrs({
    projectId: () => generateEntityId(),
    cursor: () => undefined,
    limit: () => 20,
  });
