import { ApiProperty } from '@nestjs/swagger';

import { ProjectStatus } from '@module/project/entities/project.entity';

import { BaseResponseDto } from '@common/base/base.dto';

export class ProjectResponseDto extends BaseResponseDto {
  @ApiProperty()
  ownerId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: ProjectStatus })
  status: ProjectStatus;

  @ApiProperty()
  category: string;

  @ApiProperty()
  currentMemberCount: number;

  @ApiProperty()
  tags: string[];
}
