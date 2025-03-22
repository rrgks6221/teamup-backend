import { Position } from '@module/position/entities/position.entity';

export const POSITION_SERVICE = Symbol('IPositionService');

export interface IPositionService {
  findByNamesOrFail(names: string[]): Promise<Position[]>;
}
