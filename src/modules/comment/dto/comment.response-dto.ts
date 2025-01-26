import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDto } from '@common/base/base.dto';

export class CommentResponseDto extends BaseResponseDto {
  @ApiProperty()
  authorId: string;

  @ApiProperty()
  postId: string;

  @ApiProperty()
  description: string;
}
