import { ApiProperty } from '@nestjs/swagger';

import { ProjectResponseDto } from '@module/project/dto/project.response-dto';

import { BaseCursorPaginationResponseDto } from '@common/base/base.dto';

export class ProjectCollectionDto extends BaseCursorPaginationResponseDto<ProjectResponseDto> {
  @ApiProperty({ type: [ProjectResponseDto] })
  data: ProjectResponseDto[];
}
