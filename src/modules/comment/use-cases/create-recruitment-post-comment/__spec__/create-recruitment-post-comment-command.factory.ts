import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { CommentPostType } from '@module/comment/entities/comment.entity';
import { CreateRecruitmentPostCommentCommand } from '@module/comment/use-cases/create-recruitment-post-comment/create-recruitment-post-comment.command';

import { generateEntityId } from '@common/base/base.entity';

export const CreateRecruitmentPostCommentCommandFactory =
  Factory.define<CreateRecruitmentPostCommentCommand>(
    CreateRecruitmentPostCommentCommand.name,
    CreateRecruitmentPostCommentCommand,
  ).attrs({
    projectId: () => generateEntityId(),
    postId: () => generateEntityId(),
    authorId: () => generateEntityId(),
    postType: () => CommentPostType.recruitmentPost,
    description: () => faker.string.alpha(),
  });
