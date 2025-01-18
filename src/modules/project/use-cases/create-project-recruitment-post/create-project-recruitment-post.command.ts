import { ICommand } from '@nestjs/cqrs';

export interface ICreateProjectRecruitmentPostCommandProps {
  projectId: string;
  currentUserId: string;
  title: string;
  description: string;
  positionId: string;
  techStackIds?: string[];
  maxRecruitsCount?: number;
  applicantsEndsAt?: Date;
}

export class CreateProjectRecruitmentPostCommand implements ICommand {
  readonly projectId: string;
  readonly currentUserId: string;
  readonly title: string;
  readonly description: string;
  readonly positionId: string;
  readonly techStackIds: string[];
  readonly maxRecruitsCount?: number;
  readonly applicantsEndsAt?: Date;

  constructor(props: ICreateProjectRecruitmentPostCommandProps) {
    this.projectId = props.projectId;
    this.currentUserId = props.currentUserId;
    this.title = props.title;
    this.description = props.description;
    this.positionId = props.positionId;
    this.techStackIds = props.techStackIds ?? [];
    this.maxRecruitsCount = props.maxRecruitsCount;
    this.applicantsEndsAt = props.applicantsEndsAt;
  }
}
