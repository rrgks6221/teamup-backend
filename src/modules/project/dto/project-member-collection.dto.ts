import { ApiProperty } from '@nestjs/swagger';

import { ProjectMemberResponseDto } from '@module/project/dto/project-member.response-dto';

import { BaseCursorPaginationResponseDto } from '@common/base/base.dto';

export class ProjectMemberCollectionDto extends BaseCursorPaginationResponseDto<ProjectMemberResponseDto> {
  @ApiProperty({ type: [ProjectMemberResponseDto] })
  data: ProjectMemberResponseDto[];
}
