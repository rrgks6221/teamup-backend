import { ProjectInvitationDtoAssembler } from '@module/project/assemblers/project-invitation-dto.assembler';
import { ProjectInvitationCollectionDto } from '@module/project/dto/project-invitation-collection.dto';
import { ProjectInvitation } from '@module/project/entities/project-invitation.entity';

import { ICursorPaginated } from '@common/base/base.repository';

export class ProjectInvitationCollectionDtoAssembler {
  static convertToDto(
    domainObject: ICursorPaginated<ProjectInvitation>,
  ): ProjectInvitationCollectionDto {
    const dto = new ProjectInvitationCollectionDto();

    dto.cursor = domainObject.cursor ?? null;
    dto.data = domainObject.data.map(
      ProjectInvitationDtoAssembler.convertToDto,
    );

    return dto;
  }
}
