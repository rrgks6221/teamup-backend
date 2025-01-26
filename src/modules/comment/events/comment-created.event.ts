import { CommentPostType } from '@module/comment/entities/comment.entity';

import { DomainEvent } from '@common/base/base.domain-event';

interface CommentCreatedEventPayload {
  authorId: string;
  postId: string;
  postType: CommentPostType;
  description: string;
}

export class CommentCreatedEvent extends DomainEvent<CommentCreatedEventPayload> {
  readonly aggregate = 'Comment';
}
