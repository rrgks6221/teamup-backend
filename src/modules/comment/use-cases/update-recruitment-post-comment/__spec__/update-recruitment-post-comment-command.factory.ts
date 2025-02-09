import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { UpdateRecruitmentPostCommentCommand } from '@module/comment/use-cases/update-recruitment-post-comment/update-recruitment-post-comment.command';

import { generateEntityId } from '@common/base/base.entity';

export const UpdateRecruitmentPostCommentCommandFactory =
  Factory.define<UpdateRecruitmentPostCommentCommand>(
    UpdateRecruitmentPostCommentCommand.name,
    UpdateRecruitmentPostCommentCommand,
  ).attrs({
    currentUserId: () => generateEntityId(),
    projectId: () => generateEntityId(),
    postId: () => generateEntityId(),
    commentId: () => generateEntityId(),
    description: () => faker.string.alpha(),
  });
