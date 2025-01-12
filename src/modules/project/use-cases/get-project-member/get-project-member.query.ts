import { IQuery } from '@nestjs/cqrs';

export interface IGetProjectMemberQueryProps {
  projectId: string;
  memberId: string;
}

export class GetProjectMemberQuery implements IQuery {
  readonly projectId: string;
  readonly memberId: string;

  constructor(props: IGetProjectMemberQueryProps) {
    this.projectId = props.projectId;
    this.memberId = props.memberId;
  }
}
