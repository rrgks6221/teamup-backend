import { ApiProperty } from '@nestjs/swagger';

import { ProjectRecruitmentPostResponseDto } from '@module/project/dto/project-recruitment-post.response-dto';

import { BaseCursorPaginationResponseDto } from '@common/base/base.dto';

export class ProjectRecruitmentPostCollectionDto extends BaseCursorPaginationResponseDto<ProjectRecruitmentPostResponseDto> {
  @ApiProperty({ type: [ProjectRecruitmentPostResponseDto] })
  data: ProjectRecruitmentPostResponseDto[];
}
