import { ICommand } from '@nestjs/cqrs';

import { ProjectApplicationStatus } from '@module/project/entities/project-application.entity';

export interface ICancelProjectApplicationCommandProps {
  currentUserId: string;
  projectId: string;
  applicationId: string;
}

export class CancelProjectApplicationCommand implements ICommand {
  readonly currentUserId: string;
  readonly projectId: string;
  readonly applicationId: string;
  readonly status: ProjectApplicationStatus.canceled;

  constructor(props: ICancelProjectApplicationCommandProps) {
    this.currentUserId = props.currentUserId;
    this.projectId = props.projectId;
    this.applicationId = props.applicationId;
    this.status = ProjectApplicationStatus.canceled;
  }
}
