import { ICommand } from '@nestjs/cqrs';

import { ProjectInvitationStatus } from '@module/project/entities/project-invitation.entity';

export interface IRejectProjectInvitationCommandProps {
  currentUserId: string;
  projectId: string;
  invitationId: string;
}

export class RejectProjectInvitationCommand implements ICommand {
  readonly currentUserId: string;
  readonly projectId: string;
  readonly invitationId: string;
  readonly status: ProjectInvitationStatus.rejected;

  constructor(props: IRejectProjectInvitationCommandProps) {
    this.currentUserId = props.currentUserId;
    this.projectId = props.projectId;
    this.invitationId = props.invitationId;
    this.status = ProjectInvitationStatus.rejected;
  }
}
