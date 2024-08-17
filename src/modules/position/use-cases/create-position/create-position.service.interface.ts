import { Position } from '@module/position/entities/position.entity';

import { IBaseService } from '@common/base/base-service';

export const CREATE_POSITION_SERVICE = Symbol('ICreatePositionService');

export interface ICreatePositionCommandProps {
  name: string;
}

export class CreatePositionCommand {
  readonly name: string;

  constructor(props: ICreatePositionCommandProps) {
    this.name = props.name;
  }
}

export interface ICreatePositionService
  extends IBaseService<CreatePositionCommand, Position> {}
