import { ProjectRecruitmentPostDtoAssembler } from '@module/project/assemblers/project-recruitment-post-dto.assembler';
import { ProjectRecruitmentPostCollectionDto } from '@module/project/dto/project-recruitment-post-collection.dto';
import { ProjectRecruitmentPost } from '@module/project/entities/project-recruitment-post.entity';

import { ICursorPaginated } from '@common/base/base.repository';

export class ProjectRecruitmentPostCollectionDtoAssembler {
  static convertToDto(
    domainObject: ICursorPaginated<ProjectRecruitmentPost>,
  ): ProjectRecruitmentPostCollectionDto {
    const dto = new ProjectRecruitmentPostCollectionDto();

    dto.cursor = domainObject.cursor ?? null;
    dto.data = domainObject.data.map(
      ProjectRecruitmentPostDtoAssembler.convertToDto,
    );

    return dto;
  }
}
