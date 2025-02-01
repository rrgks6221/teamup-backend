import { IQuery } from '@nestjs/cqrs';

import { CommentPostType } from '@module/comment/entities/comment.entity';

export interface IListRecruitmentPostCommentsQueryProps {
  projectId: string;
  postId: string;
  postType: CommentPostType;
  cursor?: string;
  limit?: number;
}

export class ListRecruitmentPostCommentsQuery implements IQuery {
  readonly projectId: string;
  readonly postId: string;
  readonly postType: CommentPostType;
  readonly cursor?: string;
  readonly limit: number;

  constructor(props: IListRecruitmentPostCommentsQueryProps) {
    this.postId = props.postId;
    this.projectId = props.projectId;
    this.postType = props.postType;
    this.cursor = props.cursor;
    this.limit = props.limit ?? 20;
  }
}
