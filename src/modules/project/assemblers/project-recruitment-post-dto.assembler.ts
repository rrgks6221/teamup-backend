import { ProjectRecruitmentPostResponseDto } from '@module/project/dto/project-recruitment-post.response-dto';
import { ProjectRecruitmentPost } from '@module/project/entities/project-recruitment-post.entity';

export class ProjectRecruitmentPostDtoAssembler {
  static convertToDto(
    projectRecruitmentPost: ProjectRecruitmentPost,
  ): ProjectRecruitmentPostResponseDto {
    const dto = new ProjectRecruitmentPostResponseDto({
      id: projectRecruitmentPost.id,
      createdAt: projectRecruitmentPost.createdAt,
      updatedAt: projectRecruitmentPost.updatedAt,
    });

    dto.projectId = projectRecruitmentPost.projectId;
    dto.authorId = projectRecruitmentPost.authorId;
    dto.title = projectRecruitmentPost.title;
    dto.description = projectRecruitmentPost.description;
    dto.positionName = projectRecruitmentPost.positionName;
    dto.techStackNames = projectRecruitmentPost.techStackNames;
    dto.recruitmentStatus = projectRecruitmentPost.recruitmentStatus;
    dto.commentsCount = projectRecruitmentPost.commentsCount;
    dto.viewCount = projectRecruitmentPost.viewCount;

    return dto;
  }
}
