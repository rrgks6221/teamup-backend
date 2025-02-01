import { Comment as CommentModel } from '@prisma/client';

import {
  Comment,
  CommentPostType,
} from '@module/comment/entities/comment.entity';

import { RepositoryPort } from '@common/base/base.repository';

export const COMMENT_REPOSITORY = Symbol('COMMENT_REPOSITORY');

export interface CommentRaw extends CommentModel {}

export interface CommentFilter {
  postType: CommentPostType;
  postId: string;
}

export interface CommentOrder extends Record<'never', 'desc' | 'asc'> {}

export interface CommentRepositoryPort
  extends RepositoryPort<Comment, CommentFilter, CommentOrder> {}
