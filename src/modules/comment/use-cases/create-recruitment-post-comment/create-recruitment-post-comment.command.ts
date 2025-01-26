import { ICommand } from '@nestjs/cqrs';

import { CommentPostType } from '@module/comment/entities/comment.entity';

export interface ICreateRecruitmentPostCommentCommandProps {
  projectId: string;
  postId: string;
  authorId: string;
  postType: CommentPostType;
  description: string;
}

export class CreateRecruitmentPostCommentCommand implements ICommand {
  readonly projectId: string;
  readonly postId: string;
  readonly authorId: string;
  readonly postType: CommentPostType;
  readonly description: string;

  constructor(props: ICreateRecruitmentPostCommentCommandProps) {
    this.projectId = props.projectId;
    this.postId = props.postId;
    this.authorId = props.authorId;
    this.postType = props.postType;
    this.description = props.description;
  }
}
