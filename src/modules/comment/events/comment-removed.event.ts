import { CommentPostType } from '@module/comment/entities/comment.entity';

import { DomainEvent } from '@common/base/base.domain-event';

interface CommentRemovedEventPayload {
  postId: string;
  postType: CommentPostType;
}

export class CommentRemovedEvent extends DomainEvent<CommentRemovedEventPayload> {
  readonly aggregate = 'Comment';
}
