import { Factory } from 'rosie';

import { ListProjectRecruitmentPostsQuery } from '@module/project/use-cases/list-project-recruitment-posts/list-project-recruitment-posts.query';

import { generateEntityId } from '@common/base/base.entity';

export const ListProjectRecruitmentPostsQueryFactory =
  Factory.define<ListProjectRecruitmentPostsQuery>(
    ListProjectRecruitmentPostsQuery.name,
    ListProjectRecruitmentPostsQuery,
  ).attrs({
    projectId: () => generateEntityId(),
    cursor: () => undefined,
    limit: () => 20,
  });
