import { CommentDtoAssembler } from '@module/comment/assemblers/comment-dto.assembler';
import { CommentCollectionDto } from '@module/comment/dto/comment-collection.dto';
import { Comment } from '@module/comment/entities/comment.entity';

import { ICursorPaginated } from '@common/base/base.repository';

export class CommentCollectionDtoAssembler {
  static convertToDto(
    domainObject: ICursorPaginated<Comment>,
  ): CommentCollectionDto {
    const dto = new CommentCollectionDto();

    dto.cursor = domainObject.cursor ?? null;
    dto.data = domainObject.data.map(CommentDtoAssembler.convertToDto);

    return dto;
  }
}
