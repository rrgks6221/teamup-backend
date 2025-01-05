import { IQuery } from '@nestjs/cqrs';

export interface IGetProjectQueryProps {
  projectId: string;
}

export class GetProjectQuery implements IQuery {
  readonly projectId: string;

  constructor(props: IGetProjectQueryProps) {
    this.projectId = props.projectId;
  }
}
