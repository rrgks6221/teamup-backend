import { ApiProperty } from '@nestjs/swagger';

import { AccountSnsLinkVisibilityScope } from '@module/account/entities/account-sns-link.vo';

import { BaseResponseDto } from '@common/base/base.dto';

class AccountSnsLinkResponseDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  platform: string;

  @ApiProperty({
    enum: AccountSnsLinkVisibilityScope,
  })
  visibilityScope: AccountSnsLinkVisibilityScope;
}

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

  @ApiProperty({
    type: [AccountSnsLinkResponseDto],
  })
  snsLinks: AccountSnsLinkResponseDto[];
}
