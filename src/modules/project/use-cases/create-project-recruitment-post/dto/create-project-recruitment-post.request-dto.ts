import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ArrayUnique, IsOptional, IsString } from 'class-validator';

import { IsPositiveIntString } from '@common/validators/is-positive-int-string.validator';

export class CreateProjectRecruitmentPostRequestDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  positionName: string;

  @ApiPropertyOptional({
    uniqueItems: true,
  })
  @IsPositiveIntString({ each: true })
  @ArrayUnique()
  @IsOptional()
  techStackNames?: string[];
}
