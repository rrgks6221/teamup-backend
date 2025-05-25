import { ApiProperty } from '@nestjs/swagger';

import { ProjectInvitationResponseDto } from '@module/project/dto/project-invitation.response-dto';

import { BaseCursorPaginationResponseDto } from '@common/base/base.dto';

export class ProjectInvitationCollectionDto extends BaseCursorPaginationResponseDto<ProjectInvitationResponseDto> {
  @ApiProperty({ type: [ProjectInvitationResponseDto] })
  data: ProjectInvitationResponseDto[];
}
