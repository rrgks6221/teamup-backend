import { ICommand } from '@nestjs/cqrs';

export interface ICreateProjectApplicationCommandProps {
  projectId: string;
  applicantId: string;
  positionId: string;
}

export class CreateProjectApplicationCommand implements ICommand {
  readonly projectId: string;
  readonly applicantId: string;
  readonly positionId: string;

  constructor(props: ICreateProjectApplicationCommandProps) {
    this.projectId = props.projectId;
    this.applicantId = props.applicantId;
    this.positionId = props.positionId;
  }
}
