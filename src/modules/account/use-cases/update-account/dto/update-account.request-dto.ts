import { ApiPropertyOptional } from '@nestjs/swagger';

import { ArrayUnique, IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateAccountRequestDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    uniqueItems: true,
  })
  @IsString({ each: true })
  @ArrayUnique()
  @IsArray()
  @IsOptional()
  positionIds?: string[];
}
