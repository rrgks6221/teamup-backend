import { IQuery } from '@nestjs/cqrs';

export interface IListProjectMembersQueryProps {
  projectId: string;
  cursor?: string;
  limit?: number;
}

export class ListProjectMembersQuery implements IQuery {
  readonly projectId: string;
  readonly cursor?: string;
  readonly limit: number;

  constructor(props: IListProjectMembersQueryProps) {
    this.projectId = props.projectId;
    this.cursor = props.cursor;
    this.limit = props.limit ?? 20;
  }
}
