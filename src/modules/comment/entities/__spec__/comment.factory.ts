import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import {
  Comment,
  CommentPostType,
  CommentProps,
} from '@module/comment/entities/comment.entity';

import { generateEntityId } from '@common/base/base.entity';

export const CommentFactory = Factory.define<Comment & CommentProps>(
  Comment.name,
)
  .attrs({
    id: () => generateEntityId(),
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
    postId: () => generateEntityId(),
    authorId: () => generateEntityId(),
    postType: () => faker.helpers.enumValue(CommentPostType),
    description: () => faker.string.alpha(),
  })
  .after(
    ({ id, createdAt, updatedAt, ...props }) =>
      new Comment({ id, createdAt, updatedAt, props }),
  );
