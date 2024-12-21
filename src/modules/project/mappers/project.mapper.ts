import {
  Project,
  ProjectStatus,
} from '@module/project/entities/project.entity';
import { ProjectRaw } from '@module/project/repositories/project.repository.port';

import { BaseMapper } from '@common/base/base.mapper';

export class ProjectMapper extends BaseMapper {
  static toEntity(raw: ProjectRaw): Project {
    return new Project({
      id: this.toEntityId(raw.id),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      props: {
        ownerId: this.toEntityId(raw.ownerId),
        name: raw.name,
        description: raw.description,
        status: ProjectStatus[raw.status],
        category: raw.category,
        currentMemberCount: raw.currentMemberCount,
        tags: raw.tags,
      },
    });
  }

  static toPersistence(entity: Project): ProjectRaw {
    return {
      id: this.toPrimaryKey(entity.id),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      ownerId: this.toPrimaryKey(entity.props.ownerId),
      name: entity.props.name,
      description: entity.props.description,
      status: entity.props.status,
      category: entity.props.category,
      currentMemberCount: entity.props.currentMemberCount,
      tags: entity.props.tags,
    };
  }
}
