import { ApiProperty } from '@nestjs/swagger';

import { ProjectInvitationStatus } from '@module/project/entities/project-invitation.entity';

import { BaseResponseDto } from '@common/base/base.dto';

export class ProjectInvitationResponseDto extends BaseResponseDto {
  @ApiProperty()
  projectId: string;

  @ApiProperty()
  inviterId: string;

  @ApiProperty()
  inviteeId: string;

  @ApiProperty()
  positionName: string;

  @ApiProperty({
    nullable: true,
  })
  message: string | null;

  @ApiProperty({
    enum: ProjectInvitationStatus,
  })
  status: ProjectInvitationStatus;

  @ApiProperty({
    nullable: true,
  })
  checkedAt: Date | null;

  @ApiProperty({
    nullable: true,
  })
  canceledAt: Date | null;

  @ApiProperty({
    nullable: true,
  })
  approvedAt: Date | null;

  @ApiProperty({
    nullable: true,
  })
  rejectedAt: Date | null;
}
