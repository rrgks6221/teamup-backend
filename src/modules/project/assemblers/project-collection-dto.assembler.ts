import { ProjectDtoAssembler } from '@module/project/assemblers/project-dto.assembler';
import { ProjectCollectionDto } from '@module/project/dto/project-collection.dto';
import { Project } from '@module/project/entities/project.entity';

import { ICursorPaginated } from '@common/base/base.repository';

export class ProjectCollectionDtoAssembler {
  static convertToDto(
    domainObject: ICursorPaginated<Project>,
  ): ProjectCollectionDto {
    const dto = new ProjectCollectionDto();

    dto.cursor = domainObject.cursor ?? null;
    dto.data = domainObject.data.map(ProjectDtoAssembler.convertToDto);

    return dto;
  }
}
