import { ProjectInvitationResponseDto } from '@module/project/dto/project-invitation.response-dto';
import { ProjectInvitation } from '@module/project/entities/project-invitation.entity';

export class ProjectInvitationDtoAssembler {
  static convertToDto(
    projectInvitation: ProjectInvitation,
  ): ProjectInvitationResponseDto {
    const dto = new ProjectInvitationResponseDto({
      id: projectInvitation.id,
      createdAt: projectInvitation.createdAt,
      updatedAt: projectInvitation.updatedAt,
    });

    dto.projectId = projectInvitation.projectId;
    dto.inviterId = projectInvitation.inviterId;
    dto.inviteeId = projectInvitation.inviteeId;
    dto.positionName = projectInvitation.positionName;
    dto.status = projectInvitation.status;
    dto.checkedAt = projectInvitation.checkedAt ?? null;
    dto.canceledAt = projectInvitation.canceledAt ?? null;
    dto.approvedAt = projectInvitation.approvedAt ?? null;
    dto.rejectedAt = projectInvitation.rejectedAt ?? null;

    return dto;
  }
}
