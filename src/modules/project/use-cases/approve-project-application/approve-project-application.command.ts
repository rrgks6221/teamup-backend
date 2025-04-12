import { ICommand } from '@nestjs/cqrs';

import { ProjectApplicationStatus } from '@module/project/entities/project-application.entity';

export interface IApproveProjectApplicationCommandProps {
  currentUserId: string;
  projectId: string;
  applicationId: string;
}

export class ApproveProjectApplicationCommand implements ICommand {
  readonly currentUserId: string;
  readonly projectId: string;
  readonly applicationId: string;
  readonly status: ProjectApplicationStatus.approved;

  constructor(props: IApproveProjectApplicationCommandProps) {
    this.currentUserId = props.currentUserId;
    this.projectId = props.projectId;
    this.applicationId = props.applicationId;
    this.status = ProjectApplicationStatus.approved;
  }
}
