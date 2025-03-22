import { ICommand } from '@nestjs/cqrs';

export interface ICreateProjectApplicationCommandProps {
  projectId: string;
  applicantId: string;
  positionName: string;
}

export class CreateProjectApplicationCommand implements ICommand {
  readonly projectId: string;
  readonly applicantId: string;
  readonly positionName: string;

  constructor(props: ICreateProjectApplicationCommandProps) {
    this.projectId = props.projectId;
    this.applicantId = props.applicantId;
    this.positionName = props.positionName;
  }
}
