import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsString } from 'class-validator';

export class UpdateRecruitmentPostCommentRequestDto {
  @ApiPropertyOptional()
  @IsString()
  description?: string;
}
