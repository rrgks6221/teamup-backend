import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsInt, IsOptional, IsString, Max } from 'class-validator';

export class CreateProjectRequestDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiPropertyOptional()
  @Max(99)
  @IsInt()
  @IsOptional()
  maxMemberCount?: number;

  @ApiPropertyOptional()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
