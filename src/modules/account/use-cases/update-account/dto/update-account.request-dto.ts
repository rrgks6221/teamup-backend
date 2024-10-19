import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

import { IsPositiveIntString } from '@common/validators/is-positive-int-string.validator';

class SnsLink {
  @ApiProperty()
  @IsString()
  platform: string;

  @ApiProperty()
  @IsUrl(
    { protocols: ['https'], require_protocol: true },
    { message: 'url must be a https protocol URL address' },
  )
  @IsString()
  url: string;
}

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

  @ApiProperty()
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  @Type(() => SnsLink)
  snsLinks?: SnsLink[];
}
