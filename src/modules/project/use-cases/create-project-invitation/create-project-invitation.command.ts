import { ICommand } from '@nestjs/cqrs';

export interface ICreateProjectInvitationCommandProps {
  projectId: string;
  inviterId: string;
  inviteeId: string;
  positionName: string;
}

export class CreateProjectInvitationCommand implements ICommand {
  readonly projectId: string;
  inviterId: string;
  inviteeId: string;
  readonly positionName: string;

  constructor(props: ICreateProjectInvitationCommandProps) {
    this.projectId = props.projectId;
    this.inviterId = props.inviterId;
    this.inviteeId = props.inviteeId;
    this.positionName = props.positionName;
  }
}
