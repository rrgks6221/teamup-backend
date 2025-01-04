import { IQuery } from '@nestjs/cqrs';

import { ProjectStatus } from '@module/project/entities/project.entity';

export interface IListProjectsQueryProps {
  cursor?: string;
  limit?: number;
  statuses?: ProjectStatus[];
}

export class ListProjectsQuery implements IQuery {
  readonly cursor?: string;
  readonly limit: number;
  readonly statuses?: ProjectStatus[];

  constructor(props: IListProjectsQueryProps) {
    this.cursor = props.cursor;
    this.limit = props.limit ?? 20;
    this.statuses = props.statuses;
  }
}
