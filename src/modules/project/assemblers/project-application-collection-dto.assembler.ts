import { ProjectApplicationDtoAssembler } from '@module/project/assemblers/project-application-dto.assembler';
import { ProjectApplicationCollectionDto } from '@module/project/dto/project-application-collection.dto';
import { ProjectApplication } from '@module/project/entities/project-application.entity';

import { ICursorPaginated } from '@common/base/base.repository';

export class ProjectApplicationCollectionDtoAssembler {
  static convertToDto(
    domainObject: ICursorPaginated<ProjectApplication>,
  ): ProjectApplicationCollectionDto {
    const dto = new ProjectApplicationCollectionDto();

    dto.cursor = domainObject.cursor ?? null;
    dto.data = domainObject.data.map(
      ProjectApplicationDtoAssembler.convertToDto,
    );

    return dto;
  }
}
