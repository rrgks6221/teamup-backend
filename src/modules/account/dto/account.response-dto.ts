import { ApiPropertyOptional } from '@nestjs/swagger';

import { BaseResponseDto } from '@common/base/base.dto';

export class AccountResponseDto extends BaseResponseDto {
  @ApiPropertyOptional()
  nickname?: string;
}
