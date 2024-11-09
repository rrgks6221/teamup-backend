import { ICommand } from '@nestjs/cqrs';

export interface ICreateTechStackCommandProps {
  name: string;
}

export class CreateTechStackCommand implements ICommand {
  readonly name: string;

  constructor(props: ICreateTechStackCommandProps) {
    this.name = props.name;
  }
}
