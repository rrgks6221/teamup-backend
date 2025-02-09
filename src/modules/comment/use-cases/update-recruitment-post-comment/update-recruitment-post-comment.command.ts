import { ICommand } from '@nestjs/cqrs';

export interface IUpdateRecruitmentPostCommentCommandProps {
  currentUserId: string;
  projectId: string;
  postId: string;
  commentId: string;
  description?: string;
}

export class UpdateRecruitmentPostCommentCommand implements ICommand {
  readonly currentUserId: string;
  readonly projectId: string;
  readonly postId: string;
  readonly commentId: string;
  readonly description?: string;

  constructor(props: IUpdateRecruitmentPostCommentCommandProps) {
    this.currentUserId = props.currentUserId;
    this.projectId = props.projectId;
    this.postId = props.postId;
    this.commentId = props.commentId;
    this.description = props.description;
  }
}
