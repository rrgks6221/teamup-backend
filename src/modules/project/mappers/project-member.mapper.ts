import {
  ProjectMember,
  ProjectMemberRole,
} from '@module/project/entities/project-member.entity';
import { ProjectMemberRaw } from '@module/project/repositories/project-member.repository.port';

import { BaseMapper } from '@common/base/base.mapper';

export class ProjectMemberMapper extends BaseMapper {
  static toEntity(raw: ProjectMemberRaw): ProjectMember {
    return new ProjectMember({
      id: this.toEntityId(raw.id),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      props: {
        accountId: this.toEntityId(raw.accountId),
        projectId: this.toEntityId(raw.projectId),
        position: raw.position ?? undefined,
        role: ProjectMemberRole[raw.role],
        name: raw.name,
        profileImagePath: raw.profileImagePath ?? undefined,
        techStackNames: raw.techStackNames,
      },
    });
  }

  static toPersistence(entity: ProjectMember): ProjectMemberRaw {
    return {
      id: this.toPrimaryKey(entity.id),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      accountId: this.toPrimaryKey(entity.props.accountId),
      projectId: this.toPrimaryKey(entity.props.projectId),
      position: entity.props.position ?? null,
      role: entity.props.role,
      name: entity.props.name,
      profileImagePath: entity.props.profileImagePath ?? null,
      techStackNames: entity.props.techStackNames,
    };
  }
}
