import { ICommand } from '@nestjs/cqrs';

export interface ICreateProjectCommandProps {
  ownerId: string;
  name: string;
  description: string;
  category: string;
  maxMemberCount?: number;
  tags?: string[];
}

export class CreateProjectCommand implements ICommand {
  readonly ownerId: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly maxMemberCount?: number;
  readonly tags?: string[];

  constructor(props: ICreateProjectCommandProps) {
    this.ownerId = props.ownerId;
    this.name = props.name;
    this.description = props.description;
    this.category = props.category;
    this.maxMemberCount = props.maxMemberCount;
    this.tags = props.tags;
  }
}
