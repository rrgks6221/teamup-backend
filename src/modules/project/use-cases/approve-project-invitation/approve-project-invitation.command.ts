import { ICommand } from '@nestjs/cqrs';

import { ProjectInvitationStatus } from '@module/project/entities/project-invitation.entity';

export interface IApproveProjectInvitationCommandProps {
  currentUserId: string;
  projectId: string;
  invitationId: string;
}

export class ApproveProjectInvitationCommand implements ICommand {
  readonly currentUserId: string;
  readonly projectId: string;
  readonly invitationId: string;
  readonly status: ProjectInvitationStatus.approved;

  constructor(props: IApproveProjectInvitationCommandProps) {
    this.currentUserId = props.currentUserId;
    this.projectId = props.projectId;
    this.invitationId = props.invitationId;
    this.status = ProjectInvitationStatus.approved;
  }
}
