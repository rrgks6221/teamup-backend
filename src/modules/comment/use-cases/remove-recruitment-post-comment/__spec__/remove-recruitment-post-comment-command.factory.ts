import { Factory } from 'rosie';

import { RemoveRecruitmentPostCommentCommand } from '@module/comment/use-cases/remove-recruitment-post-comment/remove-recruitment-post-comment.command';

import { generateEntityId } from '@common/base/base.entity';

export const RemoveRecruitmentPostCommentCommandFactory =
  Factory.define<RemoveRecruitmentPostCommentCommand>(
    RemoveRecruitmentPostCommentCommand.name,
    RemoveRecruitmentPostCommentCommand,
  ).attrs({
    currentUserId: () => generateEntityId(),
    projectId: () => generateEntityId(),
    postId: () => generateEntityId(),
    commentId: () => generateEntityId(),
  });
