import { ICommand } from '@nestjs/cqrs';

import { ProjectInvitationStatus } from '@module/project/entities/project-invitation.entity';

export interface ICheckProjectInvitationCommandProps {
  currentUserId: string;
  projectId: string;
  invitationId: string;
}

export class CheckProjectInvitationCommand implements ICommand {
  readonly currentUserId: string;
  readonly projectId: string;
  readonly invitationId: string;
  readonly status: ProjectInvitationStatus.checked;

  constructor(props: ICheckProjectInvitationCommandProps) {
    this.currentUserId = props.currentUserId;
    this.projectId = props.projectId;
    this.invitationId = props.invitationId;
    this.status = ProjectInvitationStatus.checked;
  }
}
