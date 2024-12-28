import { ICommand } from '@nestjs/cqrs';

export interface IRemoveProjectMemberCommandProps {
  currentUserId: string;
  projectId: string;
  memberId: string;
}

export class RemoveProjectMemberCommand implements ICommand {
  readonly currentUserId: string;
  readonly projectId: string;
  readonly memberId: string;

  constructor(props: IRemoveProjectMemberCommandProps) {
    this.currentUserId = props.currentUserId;
    this.projectId = props.projectId;
    this.memberId = props.memberId;
  }
}
