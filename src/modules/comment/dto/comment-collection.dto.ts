import { ApiProperty } from '@nestjs/swagger';

import { CommentResponseDto } from '@module/comment/dto/comment.response-dto';

import { BaseCursorPaginationResponseDto } from '@common/base/base.dto';

export class CommentCollectionDto extends BaseCursorPaginationResponseDto<CommentResponseDto> {
  @ApiProperty({ type: [CommentResponseDto] })
  data: CommentResponseDto[];
}
