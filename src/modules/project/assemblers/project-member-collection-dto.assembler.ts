import { ProjectMemberDtoAssembler } from '@module/project/assemblers/project-member-dto.assembler';
import { ProjectMemberCollectionDto } from '@module/project/dto/project-member-collection.dto';
import { ProjectMember } from '@module/project/entities/project-member.entity';

import { ICursorPaginated } from '@common/base/base.repository';

export class ProjectMemberCollectionDtoAssembler {
  static convertToDto(
    domainObject: ICursorPaginated<ProjectMember>,
  ): ProjectMemberCollectionDto {
    const dto = new ProjectMemberCollectionDto();

    dto.cursor = domainObject.cursor ?? null;
    dto.data = domainObject.data.map(ProjectMemberDtoAssembler.convertToDto);

    return dto;
  }
}
