import { ProjectInvitationValidationError } from '@module/project/errors/project-invitation-validation.error';

import {
  BaseEntity,
  CreateEntityProps,
  generateEntityId,
} from '@common/base/base.entity';

export enum ProjectInvitationStatus {
  pending = 'pending',
  checked = 'checked',
  canceled = 'canceled',
  approved = 'approved',
  rejected = 'rejected',
}

export interface ProjectInvitationProps {
  projectId: string;
  inviterId: string;
  inviteeId: string;
  positionName: string;
  status: ProjectInvitationStatus;
  checkedAt?: Date;
  canceledAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
}

interface CreateProjectInvitationProps {
  projectId: string;
  inviterId: string;
  inviteeId: string;
  positionName: string;
}

export class ProjectInvitation extends BaseEntity<ProjectInvitationProps> {
  constructor(props: CreateEntityProps<ProjectInvitationProps>) {
    super(props);
  }

  static create(createProjectInvitationProps: CreateProjectInvitationProps) {
    const id = generateEntityId();
    const date = new Date();

    return new ProjectInvitation({
      id,
      props: {
        projectId: createProjectInvitationProps.projectId,
        inviterId: createProjectInvitationProps.inviterId,
        inviteeId: createProjectInvitationProps.inviteeId,
        positionName: createProjectInvitationProps.positionName,
        status: ProjectInvitationStatus.pending,
        checkedAt: undefined,
        canceledAt: undefined,
        approvedAt: undefined,
        rejectedAt: undefined,
      },
      createdAt: date,
      updatedAt: date,
    });
  }

  get projectId() {
    return this.props.projectId;
  }

  get inviterId() {
    return this.props.inviterId;
  }

  get inviteeId() {
    return this.props.inviteeId;
  }

  get positionName() {
    return this.props.positionName;
  }

  get status() {
    return this.props.status;
  }

  get checkedAt() {
    return this.props.checkedAt;
  }

  get canceledAt() {
    return this.props.canceledAt;
  }

  get approvedAt() {
    return this.props.approvedAt;
  }

  get rejectedAt() {
    return this.props.rejectedAt;
  }

  getProgress() {
    if (
      this.status === ProjectInvitationStatus.canceled ||
      this.status === ProjectInvitationStatus.approved ||
      this.status === ProjectInvitationStatus.rejected
    ) {
      return 'processed';
    }
    return 'inprogress';
  }

  markAsChecked() {
    if (this.status !== ProjectInvitationStatus.pending) {
      throw new ProjectInvitationValidationError(
        'Project invitation checked is only possible in the pending state',
      );
    }

    const now = new Date();

    this.props.status = ProjectInvitationStatus.checked;
    this.props.checkedAt = now;
    this.updatedAt = now;
  }

  approve() {
    if (this.status !== ProjectInvitationStatus.checked) {
      throw new ProjectInvitationValidationError(
        'Project invitation approve is only possible in the checked state',
      );
    }

    const now = new Date();

    this.props.status = ProjectInvitationStatus.approved;
    this.props.approvedAt = now;
    this.updatedAt = now;
  }

  public validate(): void {}
}
