import { ICommand } from '@nestjs/cqrs';

import { ProjectApplicationStatus } from '@module/project/entities/project-application.entity';

export interface ICheckProjectApplicationCommandProps {
  currentUserId: string;
  projectId: string;
  applicationId: string;
}

export class CheckProjectApplicationCommand implements ICommand {
  readonly currentUserId: string;
  readonly projectId: string;
  readonly applicationId: string;
  readonly status: ProjectApplicationStatus.checked;

  constructor(props: ICheckProjectApplicationCommandProps) {
    this.currentUserId = props.currentUserId;
    this.projectId = props.projectId;
    this.applicationId = props.applicationId;
    this.status = ProjectApplicationStatus.checked;
  }
}
