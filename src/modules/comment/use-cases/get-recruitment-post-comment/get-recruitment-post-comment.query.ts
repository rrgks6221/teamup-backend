import { IQuery } from '@nestjs/cqrs';

export interface IGetRecruitmentPostCommentQueryProps {
  projectId: string;
  postId: string;
  commentId: string;
}

export class GetRecruitmentPostCommentQuery implements IQuery {
  readonly projectId: string;
  readonly postId: string;
  readonly commentId: string;

  constructor(props: IGetRecruitmentPostCommentQueryProps) {
    this.projectId = props.projectId;
    this.postId = props.postId;
    this.commentId = props.commentId;
  }
}
