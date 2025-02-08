import { ICommand } from '@nestjs/cqrs';

export interface IRemoveRecruitmentPostCommentCommandProps {
  currentUserId: string;
  projectId: string;
  postId: string;
  commentId: string;
}

export class RemoveRecruitmentPostCommentCommand implements ICommand {
  readonly currentUserId: string;
  readonly projectId: string;
  readonly postId: string;
  readonly commentId: string;

  constructor(props: IRemoveRecruitmentPostCommentCommandProps) {
    this.currentUserId = props.currentUserId;
    this.projectId = props.projectId;
    this.postId = props.postId;
    this.commentId = props.commentId;
  }
}
