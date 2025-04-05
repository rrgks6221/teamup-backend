import { ApiProperty } from '@nestjs/swagger';

import { ProjectApplicationStatus } from '@module/project/entities/project-application.entity';

import { BaseResponseDto } from '@common/base/base.dto';

export class ProjectApplicationResponseDto extends BaseResponseDto {
  @ApiProperty()
  projectId: string;

  @ApiProperty()
  applicantId: string;

  @ApiProperty()
  positionName: string;

  @ApiProperty({
    nullable: true,
  })
  message: string | null;

  @ApiProperty({
    enum: ProjectApplicationStatus,
  })
  status: ProjectApplicationStatus;

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
