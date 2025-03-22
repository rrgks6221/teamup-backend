import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

export class CreateProjectApplicationRequestDto {
  @ApiProperty()
  @IsString()
  positionName: string;
}
