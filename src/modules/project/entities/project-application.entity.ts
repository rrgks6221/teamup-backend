import { ProjectApplicationValidationError } from '@module/project/errors/project-application-validation.error';

import {
  BaseEntity,
  CreateEntityProps,
  generateEntityId,
} from '@common/base/base.entity';

export enum ProjectApplicationStatus {
  pending = 'pending',
  checked = 'checked',
  approved = 'approved',
  rejected = 'rejected',
}

export interface ProjectApplicationProps {
  projectId: string;
  applicantId: string;
  position: string;
  status: ProjectApplicationStatus;
  checkedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
}

interface CreateProjectApplicationProps {
  projectId: string;
  applicantId: string;
  position: string;
}

export class ProjectApplication extends BaseEntity<ProjectApplicationProps> {
  constructor(props: CreateEntityProps<ProjectApplicationProps>) {
    super(props);
  }

  static create(createProjectApplicationProps: CreateProjectApplicationProps) {
    const id = generateEntityId();
    const date = new Date();

    return new ProjectApplication({
      id,
      props: {
        projectId: createProjectApplicationProps.projectId,
        applicantId: createProjectApplicationProps.applicantId,
        position: createProjectApplicationProps.position,
        status: ProjectApplicationStatus.pending,
        checkedAt: undefined,
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

  get applicantId() {
    return this.props.applicantId;
  }

  get position() {
    return this.props.position;
  }

  get status() {
    return this.props.status;
  }

  get checkedAt() {
    return this.props.checkedAt;
  }

  get approvedAt() {
    return this.props.approvedAt;
  }

  get rejectedAt() {
    return this.props.rejectedAt;
  }

  getProgress() {
    if (
      this.status === ProjectApplicationStatus.approved ||
      this.status === ProjectApplicationStatus.rejected
    ) {
      return 'processed';
    }
    return 'inprogress';
  }

  markAsChecked() {
    if (this.status !== ProjectApplicationStatus.pending) {
      throw new ProjectApplicationValidationError(
        'Project application checked is only possible in the pending state',
      );
    }

    const now = new Date();

    this.props.status = ProjectApplicationStatus.checked;
    this.props.checkedAt = now;
    this.updatedAt = now;
  }

  approve() {
    if (this.status !== ProjectApplicationStatus.checked) {
      throw new ProjectApplicationValidationError(
        'Project application approve is only possible in the checked state',
      );
    }

    const now = new Date();

    this.props.status = ProjectApplicationStatus.approved;
    this.props.approvedAt = now;
    this.updatedAt = now;
  }

  reject() {
    if (this.status !== ProjectApplicationStatus.checked) {
      throw new ProjectApplicationValidationError(
        'Project application reject is only possible in the checked state',
      );
    }

    const now = new Date();

    this.props.status = ProjectApplicationStatus.rejected;
    this.props.rejectedAt = now;
    this.updatedAt = now;
  }

  public validate(): void {}
}
