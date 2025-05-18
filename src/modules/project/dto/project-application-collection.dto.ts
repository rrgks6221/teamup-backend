import { ApiProperty } from '@nestjs/swagger';

import { ProjectApplicationResponseDto } from '@module/project/dto/project-application.response-dto';

import { BaseCursorPaginationResponseDto } from '@common/base/base.dto';

export class ProjectApplicationCollectionDto extends BaseCursorPaginationResponseDto<ProjectApplicationResponseDto> {
  @ApiProperty({ type: [ProjectApplicationResponseDto] })
  data: ProjectApplicationResponseDto[];
}
