import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

export class UpdateAccountRequestDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;
}
