import { Position } from '@module/position/entities/position.entity';

export const POSITION_SERVICE = Symbol('IPositionService');

export interface IPositionService {
  findByIdsOrFail(ids: string[]): Promise<Position[]>;
}
