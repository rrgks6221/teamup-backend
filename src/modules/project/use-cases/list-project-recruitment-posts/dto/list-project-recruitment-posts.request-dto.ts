import { ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListProjectRecruitmentPostsRequestDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  cursor?: string;

  @ApiPropertyOptional({
    format: 'integer',
    minimum: 10,
    maximum: 100,
  })
  @Max(100)
  @Min(10)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  limit?: number;
}
