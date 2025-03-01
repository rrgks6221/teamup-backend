import { ApiProperty } from '@nestjs/swagger';

import { IsPositiveIntString } from '@common/validators/is-positive-int-string.validator';

export class CreateProjectApplicationRequestDto {
  @ApiProperty()
  @IsPositiveIntString()
  positionId: string;
}
