import { Factory } from 'rosie';

import { CommentPostType } from '@module/comment/entities/comment.entity';
import { ListRecruitmentPostCommentsQuery } from '@module/comment/use-cases/list-recruitment-post-comments/list-recruitment-post-comments.query';

import { generateEntityId } from '@common/base/base.entity';

export const ListRecruitmentPostCommentsQueryFactory =
  Factory.define<ListRecruitmentPostCommentsQuery>(
    ListRecruitmentPostCommentsQuery.name,
    ListRecruitmentPostCommentsQuery,
  ).attrs({
    projectId: () => generateEntityId(),
    postId: () => generateEntityId(),
    postType: () => CommentPostType.recruitmentPost,
    cursor: () => undefined,
    limit: () => 20,
  });
