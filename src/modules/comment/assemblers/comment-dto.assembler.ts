import { CommentResponseDto } from '@module/comment/dto/comment.response-dto';
import { Comment } from '@module/comment/entities/comment.entity';

export class CommentDtoAssembler {
  static convertToDto(comment: Comment): CommentResponseDto {
    const dto = new CommentResponseDto({
      id: comment.id,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    });

    dto.authorId = comment.authorId;
    dto.postId = comment.postId;
    dto.description = comment.description;

    return dto;
  }
}
