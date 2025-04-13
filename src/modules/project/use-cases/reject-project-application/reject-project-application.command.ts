import { ICommand } from '@nestjs/cqrs';

import { ProjectApplicationStatus } from '@module/project/entities/project-application.entity';

export interface IRejectProjectApplicationCommandProps {
  currentUserId: string;
  projectId: string;
  applicationId: string;
}

export class RejectProjectApplicationCommand implements ICommand {
  readonly currentUserId: string;
  readonly projectId: string;
  readonly applicationId: string;
  readonly status: ProjectApplicationStatus.rejected;

  constructor(props: IRejectProjectApplicationCommandProps) {
    this.currentUserId = props.currentUserId;
    this.projectId = props.projectId;
    this.applicationId = props.applicationId;
    this.status = ProjectApplicationStatus.rejected;
  }
}
