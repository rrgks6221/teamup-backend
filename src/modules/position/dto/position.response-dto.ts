import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDto } from '@common/base/base.dto';

export class PositionResponseDto extends BaseResponseDto {
  @ApiProperty({
    uniqueItems: true,
  })
  name: string;
}
