import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  ArrayUnique,
  IsISO8601,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { IsPositiveIntString } from '@common/validators/is-positive-int-string.validator';

export class CreateProjectRecruitmentPostRequestDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsPositiveIntString()
  positionId: string;

  @ApiPropertyOptional({
    uniqueItems: true,
  })
  @IsPositiveIntString({ each: true })
  @ArrayUnique()
  @IsOptional()
  techStackIds?: string[];

  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  @IsOptional()
  maxRecruitsCount?: number;

  @ApiPropertyOptional()
  @IsISO8601()
  @IsOptional()
  applicantsEndsAt?: Date;
}
