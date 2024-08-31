import { TechStack } from '@module/tech-stack/entities/tech-stack.entity';

import { IBaseService } from '@common/base/base-service';

export const CREATE_TECH_STACK_SERVICE = Symbol('ICreateTechStackService');

export interface ICreateTechStackCommandProps {
  name: string;
}

export class CreateTechStackCommand {
  readonly name: string;

  constructor(props: ICreateTechStackCommandProps) {
    this.name = props.name;
  }
}

export interface ICreateTechStackService
  extends IBaseService<CreateTechStackCommand, TechStack> {}
