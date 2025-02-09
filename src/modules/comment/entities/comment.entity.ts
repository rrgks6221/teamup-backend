import { CommentCreatedEvent } from '@module/comment/events/comment-created.event';
import { CommentRemovedEvent } from '@module/comment/events/comment-removed.event';
import { CommentUpdatedEvent } from '@module/comment/events/comment-updated.event';

import {
  AggregateRoot,
  CreateEntityProps,
  generateEntityId,
} from '@common/base/base.entity';

export enum CommentPostType {
  recruitmentPost = 'recruitmentPost',
}

export interface CommentProps {
  postId: string;
  authorId: string;
  postType: CommentPostType;
  description: string;
}

interface CreateCommentProps {
  postId: string;
  authorId: string;
  postType: CommentPostType;
  description: string;
}

interface UpdateCommentProps {
  description?: string;
}

export class Comment extends AggregateRoot<CommentProps> {
  constructor(props: CreateEntityProps<CommentProps>) {
    super(props);
  }

  static create(createCommentProps: CreateCommentProps) {
    const id = generateEntityId();
    const date = new Date();

    const comment = new Comment({
      id,
      props: {
        postId: createCommentProps.postId,
        authorId: createCommentProps.authorId,
        postType: createCommentProps.postType,
        description: createCommentProps.description,
      },
      createdAt: date,
      updatedAt: date,
    });

    comment.apply(
      new CommentCreatedEvent(comment.id, {
        postId: createCommentProps.postId,
        authorId: createCommentProps.authorId,
        postType: createCommentProps.postType,
        description: createCommentProps.description,
      }),
    );

    return comment;
  }

  get postId() {
    return this.props.postId;
  }

  get authorId() {
    return this.props.authorId;
  }

  get postType() {
    return this.props.postType;
  }

  get description() {
    return this.props.description;
  }

  update(props: UpdateCommentProps) {
    if (props.description !== undefined) {
      this.props.description = props.description;
    }

    this.updatedAt = new Date();

    this.apply(
      new CommentUpdatedEvent(this.id, {
        description: props.description,
      }),
    );

    return this;
  }

  remove() {
    this.apply(
      new CommentRemovedEvent(this.id, {
        postId: this.props.postId,
        postType: this.props.postType,
      }),
    );
  }

  public validate(): void {}
}
