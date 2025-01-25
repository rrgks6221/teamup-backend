import { Factory } from 'rosie';

import { GetProjectRecruitmentPostQuery } from '@module/project/use-cases/get-project-recruitment-post/get-project-recruitment-post.query';

import { generateEntityId } from '@common/base/base.entity';

export const GetProjectRecruitmentPostQueryFactory =
  Factory.define<GetProjectRecruitmentPostQuery>(
    GetProjectRecruitmentPostQuery.name,
    GetProjectRecruitmentPostQuery,
  ).attrs({
    projectId: () => generateEntityId(),
    projectRecruitmentPostId: () => generateEntityId(),
  });
