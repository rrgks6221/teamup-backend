import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

export class CreateTechStackRequestDto {
  @ApiProperty()
  @IsString()
  name: string;
}
