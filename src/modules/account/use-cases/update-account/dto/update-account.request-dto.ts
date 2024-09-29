import { ApiPropertyOptional } from '@nestjs/swagger';

import { ArrayUnique, IsArray, IsOptional, IsString } from 'class-validator';

import { IsPositiveIntString } from '@common/validators/is-positive-int-string.validator';

export class UpdateAccountRequestDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  introduce?: string;

  @ApiPropertyOptional({
    uniqueItems: true,
  })
  @IsPositiveIntString({ each: true })
  @ArrayUnique()
  @IsArray()
  @IsOptional()
  positionIds?: string[];

  @ApiPropertyOptional({
    uniqueItems: true,
  })
  @IsPositiveIntString({ each: true })
  @ArrayUnique()
  @IsArray()
  @IsOptional()
  techStackIds?: string[];
}
