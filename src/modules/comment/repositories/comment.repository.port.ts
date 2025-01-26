import { Comment as CommentModel } from '@prisma/client';

import { Comment } from '@module/comment/entities/comment.entity';

import { RepositoryPort } from '@common/base/base.repository';

export const COMMENT_REPOSITORY = Symbol('COMMENT_REPOSITORY');

export interface CommentRaw extends CommentModel {}

export interface CommentFilter {}

export interface CommentRepositoryPort
  extends RepositoryPort<Comment, CommentFilter> {}
