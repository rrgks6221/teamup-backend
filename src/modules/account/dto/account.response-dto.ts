import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDto } from '@common/base/base.dto';

export class AccountResponseDto extends BaseResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty({
    nullable: true,
  })
  introduce: string | null;

  @ApiProperty()
  positionNames: string[];

  @ApiProperty()
  techStackNames: string[];
}
