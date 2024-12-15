import { ProjectMemberResponseDto } from '@module/project/dto/project-member.response-dto';
import { ProjectMember } from '@module/project/entities/project-member.entity';

export class ProjectMemberDtoAssembler {
  static convertToDto(projectMember: ProjectMember): ProjectMemberResponseDto {
    const dto = new ProjectMemberResponseDto({
      id: projectMember.id,
      createdAt: projectMember.createdAt,
      updatedAt: projectMember.updatedAt,
    });

    dto.accountId = projectMember.accountId;
    dto.projectId = projectMember.projectId;
    dto.position = projectMember.position;
    dto.role = projectMember.role;
    dto.name = projectMember.name;
    dto.profileImagePath = projectMember.profileImagePath;
    dto.techStackNames = projectMember.techStackNames;

    return dto;
  }
}
