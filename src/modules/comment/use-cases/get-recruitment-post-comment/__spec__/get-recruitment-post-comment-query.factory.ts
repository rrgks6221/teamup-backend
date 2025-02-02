import { Factory } from 'rosie';

import { GetRecruitmentPostCommentQuery } from '@module/comment/use-cases/get-recruitment-post-comment/get-recruitment-post-comment.query';

import { generateEntityId } from '@common/base/base.entity';

export const GetRecruitmentPostCommentQueryFactory =
  Factory.define<GetRecruitmentPostCommentQuery>(
    GetRecruitmentPostCommentQuery.name,
    GetRecruitmentPostCommentQuery,
  ).attrs({
    projectId: () => generateEntityId(),
    postId: () => generateEntityId(),
    commentId: () => generateEntityId(),
  });
