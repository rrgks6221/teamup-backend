import { IQuery } from '@nestjs/cqrs';

export interface IGetProjectRecruitmentPostQueryProps {
  projectRecruitmentPostId: string;
  projectId?: string;
}

export class GetProjectRecruitmentPostQuery implements IQuery {
  readonly projectRecruitmentPostId: string;
  readonly projectId?: string;

  constructor(props: IGetProjectRecruitmentPostQueryProps) {
    this.projectRecruitmentPostId = props.projectRecruitmentPostId;
    this.projectId = props.projectId;
  }
}
