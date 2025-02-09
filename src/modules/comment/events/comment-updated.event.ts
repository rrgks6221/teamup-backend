import { DomainEvent } from '@common/base/base.domain-event';

interface CommentUpdatedEventPayload {
  description?: string;
}

export class CommentUpdatedEvent extends DomainEvent<CommentUpdatedEventPayload> {
  readonly aggregate = 'Comment';
}
