import {
  ProjectApplication,
  ProjectApplicationStatus,
} from '@module/project/entities/project-application.entity';
import { ProjectApplicationRaw } from '@module/project/repositories/project-application.repository.port';

import { BaseMapper } from '@common/base/base.mapper';

export class ProjectApplicationMapper extends BaseMapper {
  static toEntity(raw: ProjectApplicationRaw): ProjectApplication {
    return new ProjectApplication({
      id: this.toEntityId(raw.id),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      props: {
        projectId: this.toEntityId(raw.projectId),
        applicantId: this.toEntityId(raw.applicantId),
        positionName: raw.positionName,
        status: ProjectApplicationStatus[raw.status],
        checkedAt: raw.checkedAt ?? undefined,
        approvedAt: raw.approvedAt ?? undefined,
        rejectedAt: raw.rejectedAt ?? undefined,
      },
    });
  }

  static toPersistence(entity: ProjectApplication): ProjectApplicationRaw {
    return {
      id: this.toPrimaryKey(entity.id),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      projectId: this.toPrimaryKey(entity.props.projectId),
      applicantId: this.toPrimaryKey(entity.props.applicantId),
      positionName: entity.props.positionName,
      status: entity.props.status,
      checkedAt: entity.props.checkedAt ?? null,
      approvedAt: entity.props.approvedAt ?? null,
      rejectedAt: entity.props.rejectedAt ?? null,
    };
  }
}
