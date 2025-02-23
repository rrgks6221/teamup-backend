import { ICommand } from '@nestjs/cqrs';

export interface IIncrementRecruitmentPostViewCountCommandProps {
  postId: string;
}

export class IncrementRecruitmentPostViewCountCommand implements ICommand {
  readonly postId: string;

  constructor(props: IIncrementRecruitmentPostViewCountCommandProps) {
    this.postId = props.postId;
  }
}
