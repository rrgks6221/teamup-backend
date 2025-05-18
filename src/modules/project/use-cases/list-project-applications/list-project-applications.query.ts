import { IQuery } from '@nestjs/cqrs';

export interface IListProjectApplicationsQueryProps {
  currentUserId: string;
  projectId: string;
  cursor?: string;
  limit?: number;
}

export class ListProjectApplicationsQuery implements IQuery {
  readonly currentUserId: string;
  readonly projectId: string;
  readonly cursor?: string;
  readonly limit: number;

  constructor(props: IListProjectApplicationsQueryProps) {
    this.currentUserId = props.currentUserId;
    this.projectId = props.projectId;
    this.cursor = props.cursor;
    this.limit = props.limit ?? 20;
  }
}
