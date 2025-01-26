import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

export class CreateRecruitmentPostCommentRequestDto {
  @ApiProperty()
  @IsString()
  description: string;
}
