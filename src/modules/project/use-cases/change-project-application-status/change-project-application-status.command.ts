import { ICommand } from '@nestjs/cqrs';

import { ProjectApplicationStatus } from '@module/project/entities/project-application.entity';

export interface IChangeProjectApplicationStatusCommandProps {
  currentUserId: string;
  projectId: string;
  applicationId: string;
  status: Exclude<
    ProjectApplicationStatus,
    ProjectApplicationStatus.pending | ProjectApplicationStatus.canceled
  >;
}

export class ChangeProjectApplicationStatusCommand implements ICommand {
  readonly currentUserId: string;
  readonly projectId: string;
  readonly applicationId: string;
  status: Exclude<
    ProjectApplicationStatus,
    ProjectApplicationStatus.pending | ProjectApplicationStatus.canceled
  >;

  constructor(props: IChangeProjectApplicationStatusCommandProps) {
    this.currentUserId = props.currentUserId;
    this.projectId = props.projectId;
    this.applicationId = props.applicationId;
    this.status = props.status;
  }
}
