import { ICommand } from '@nestjs/cqrs';

export interface ICreatePositionCommandProps {
  name: string;
}

export class CreatePositionCommand implements ICommand {
  readonly name: string;

  constructor(props: ICreatePositionCommandProps) {
    this.name = props.name;
  }
}
