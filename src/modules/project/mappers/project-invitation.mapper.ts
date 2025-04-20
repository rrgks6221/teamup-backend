import {
  ProjectInvitation,
  ProjectInvitationStatus,
} from '@module/project/entities/project-invitation.entity';
import { ProjectInvitationRaw } from '@module/project/repositories/project-invitation.repository.port';

import { BaseMapper } from '@common/base/base.mapper';

export class ProjectInvitationMapper extends BaseMapper {
  static toEntity(raw: ProjectInvitationRaw): ProjectInvitation {
    return new ProjectInvitation({
      id: this.toEntityId(raw.id),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      props: {
        projectId: this.toEntityId(raw.projectId),
        inviterId: this.toEntityId(raw.inviterId),
        inviteeId: this.toEntityId(raw.inviteeId),
        positionName: raw.positionName,
        status: ProjectInvitationStatus[raw.status],
        checkedAt: raw.checkedAt ?? undefined,
        canceledAt: raw.canceledAt ?? undefined,
        approvedAt: raw.approvedAt ?? undefined,
        rejectedAt: raw.rejectedAt ?? undefined,
      },
    });
  }

  static toPersistence(entity: ProjectInvitation): ProjectInvitationRaw {
    return {
      id: this.toPrimaryKey(entity.id),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      projectId: this.toPrimaryKey(entity.props.projectId),
      inviterId: this.toPrimaryKey(entity.props.inviterId),
      inviteeId: this.toPrimaryKey(entity.props.inviteeId),
      positionName: entity.props.positionName,
      status: entity.props.status,
      checkedAt: entity.props.checkedAt ?? null,
      canceledAt: entity.props.canceledAt ?? null,
      approvedAt: entity.props.approvedAt ?? null,
      rejectedAt: entity.props.rejectedAt ?? null,
    };
  }
}
