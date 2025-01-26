import {
  Comment,
  CommentPostType,
} from '@module/comment/entities/comment.entity';
import { CommentRaw } from '@module/comment/repositories/comment.repository.port';

import { BaseMapper } from '@common/base/base.mapper';

export class CommentMapper extends BaseMapper {
  static toEntity(raw: CommentRaw): Comment {
    return new Comment({
      id: this.toEntityId(raw.id),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      props: {
        postId: this.toEntityId(raw.postId),
        authorId: this.toEntityId(raw.authorId),
        postType: CommentPostType[raw.postType],
        description: raw.description,
      },
    });
  }

  static toPersistence(entity: Comment): CommentRaw {
    return {
      id: this.toPrimaryKey(entity.id),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      postId: this.toPrimaryKey(entity.props.postId),
      authorId: this.toPrimaryKey(entity.props.authorId),
      postType: entity.props.postType,
      description: entity.props.description,
    };
  }
}
