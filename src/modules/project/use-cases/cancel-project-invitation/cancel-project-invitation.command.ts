import { ICommand } from '@nestjs/cqrs';

import { ProjectInvitationStatus } from '@module/project/entities/project-invitation.entity';

export interface ICancelProjectInvitationCommandProps {
  currentUserId: string;
  projectId: string;
  invitationId: string;
}

export class CancelProjectInvitationCommand implements ICommand {
  readonly currentUserId: string;
  readonly projectId: string;
  readonly invitationId: string;
  readonly status: ProjectInvitationStatus.canceled;

  constructor(props: ICancelProjectInvitationCommandProps) {
    this.currentUserId = props.currentUserId;
    this.projectId = props.projectId;
    this.invitationId = props.invitationId;
    this.status = ProjectInvitationStatus.canceled;
  }
}
