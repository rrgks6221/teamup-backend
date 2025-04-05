import { ApiProperty } from '@nestjs/swagger';

import { IsIn } from 'class-validator';

import { ProjectApplicationStatus } from '@module/project/entities/project-application.entity';

export class ChangeProjectApplicationStatusRequestDto {
  @ApiProperty({
    enum: [
      ProjectApplicationStatus.approved,
      ProjectApplicationStatus.checked,
      ProjectApplicationStatus.rejected,
    ],
    enumName: 'ProjectApplicationStatusExcludePending',
  })
  @IsIn([
    ProjectApplicationStatus.approved,
    ProjectApplicationStatus.checked,
    ProjectApplicationStatus.rejected,
  ])
  status: Exclude<
    ProjectApplicationStatus,
    ProjectApplicationStatus.pending | ProjectApplicationStatus.canceled
  >;
}
