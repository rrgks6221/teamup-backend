import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

import { IsPositiveIntString } from '@common/validators/is-positive-int-string.validator';

export class CreateProjectInvitationRequestDto {
  @ApiProperty()
  @IsString()
  positionName: string;

  @ApiProperty()
  @IsPositiveIntString()
  inviteeId: string;
}
