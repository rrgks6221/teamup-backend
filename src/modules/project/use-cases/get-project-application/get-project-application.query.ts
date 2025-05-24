import { IQuery } from '@nestjs/cqrs';

export interface IGetProjectApplicationQueryProps {
  currentUserId: string;
  projectId: string;
  applicationId: string;
}

export class GetProjectApplicationQuery implements IQuery {
  readonly currentUserId: string;
  readonly projectId: string;
  readonly applicationId: string;

  constructor(props: IGetProjectApplicationQueryProps) {
    this.currentUserId = props.currentUserId;
    this.projectId = props.projectId;
    this.applicationId = props.applicationId;
  }
}
