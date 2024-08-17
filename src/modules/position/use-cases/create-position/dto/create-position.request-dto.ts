import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

export class CreatePositionRequestDto {
  @ApiProperty()
  @IsString()
  name: string;
}
