import { IQuery } from '@nestjs/cqrs';

export interface IListProjectRecruitmentPostsQueryProps {
  projectId?: string;
  cursor?: string;
  limit?: number;
}

export class ListProjectRecruitmentPostsQuery implements IQuery {
  readonly projectId?: string;
  readonly cursor?: string;
  readonly limit: number;

  constructor(props: IListProjectRecruitmentPostsQueryProps) {
    this.projectId = props.projectId;
    this.cursor = props.cursor;
    this.limit = props.limit ?? 20;
  }
}
