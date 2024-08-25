import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDto } from '@common/base/base.dto';

export class TechStackResponseDto extends BaseResponseDto {
  @ApiProperty()
  name: string;
}
