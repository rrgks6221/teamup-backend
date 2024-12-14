import { ProjectResponseDto } from '@module/project/dto/project.response-dto';
import { Project } from '@module/project/entities/project.entity';

export class ProjectDtoAssembler {
  static convertToDto(project: Project): ProjectResponseDto {
    const dto = new ProjectResponseDto({
      id: project.id,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    });

    dto.ownerId = project.ownerId;
    dto.name = project.name;
    dto.description = project.description;
    dto.status = project.status;
    dto.category = project.category;
    dto.maxMemberCount = project.maxMemberCount;
    dto.currentMemberCount = project.currentMemberCount;
    dto.tags = project.tags;

    return dto;
  }
}
