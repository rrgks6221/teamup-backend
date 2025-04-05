import { ProjectApplicationResponseDto } from '@module/project/dto/project-application.response-dto';
import { ProjectApplication } from '@module/project/entities/project-application.entity';

export class ProjectApplicationDtoAssembler {
  static convertToDto(
    projectApplication: ProjectApplication,
  ): ProjectApplicationResponseDto {
    const dto = new ProjectApplicationResponseDto({
      id: projectApplication.id,
      createdAt: projectApplication.createdAt,
      updatedAt: projectApplication.updatedAt,
    });

    dto.projectId = projectApplication.projectId;
    dto.applicantId = projectApplication.applicantId;
    dto.positionName = projectApplication.positionName;
    dto.status = projectApplication.status;
    dto.checkedAt = projectApplication.checkedAt ?? null;
    dto.canceledAt = projectApplication.canceledAt ?? null;
    dto.approvedAt = projectApplication.approvedAt ?? null;
    dto.rejectedAt = projectApplication.rejectedAt ?? null;

    return dto;
  }
}
