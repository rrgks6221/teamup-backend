import { IQuery } from '@nestjs/cqrs';

import { ProjectApplicationStatus } from '@module/project/entities/project-application.entity';

export interface IListProjectApplicationsQueryProps {
  currentUserId: string;
  projectId: string;
  cursor?: string;
  limit?: number;
  statuses?: ProjectApplicationStatus[];
}

export class ListProjectApplicationsQuery implements IQuery {
  readonly currentUserId: string;
  readonly projectId: string;
  readonly cursor?: string;
  readonly limit: number;
  readonly statuses?: ProjectApplicationStatus[];

  constructor(props: IListProjectApplicationsQueryProps) {
    this.currentUserId = props.currentUserId;
    this.projectId = props.projectId;
    this.cursor = props.cursor;
    this.limit = props.limit ?? 20;
    this.statuses = props.statuses;
  }
}
