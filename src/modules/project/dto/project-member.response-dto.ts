import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ProjectMemberRole } from '@module/project/entities/project-member.entity';

import { BaseResponseDto } from '@common/base/base.dto';

export class ProjectMemberResponseDto extends BaseResponseDto {
  @ApiProperty()
  accountId: string;

  @ApiProperty()
  projectId: string;

  @ApiPropertyOptional()
  positionName?: string;

  @ApiProperty({
    enum: ProjectMemberRole,
  })
  role: ProjectMemberRole;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  profileImagePath?: string;

  @ApiProperty()
  techStackNames: string[];
}
