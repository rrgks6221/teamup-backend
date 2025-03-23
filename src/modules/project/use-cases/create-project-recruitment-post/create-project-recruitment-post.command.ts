import { ICommand } from '@nestjs/cqrs';

export interface ICreateProjectRecruitmentPostCommandProps {
  projectId: string;
  currentUserId: string;
  title: string;
  description: string;
  positionName: string;
  techStackNames?: string[];
}

export class CreateProjectRecruitmentPostCommand implements ICommand {
  readonly projectId: string;
  readonly currentUserId: string;
  readonly title: string;
  readonly description: string;
  readonly positionName: string;
  readonly techStackNames: string[];

  constructor(props: ICreateProjectRecruitmentPostCommandProps) {
    this.projectId = props.projectId;
    this.currentUserId = props.currentUserId;
    this.title = props.title;
    this.description = props.description;
    this.positionName = props.positionName;
    this.techStackNames = props.techStackNames ?? [];
  }
}
