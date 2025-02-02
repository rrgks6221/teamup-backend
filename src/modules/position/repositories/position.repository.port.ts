import { Position as PositionModel } from '@prisma/client';

import { Position } from '@module/position/entities/position.entity';

import { RepositoryPort } from '@common/base/base.repository';

export const POSITION_REPOSITORY = Symbol('POSITION_REPOSITORY');

export interface PositionRaw extends PositionModel {}

export interface PositionFilter {}

export interface PositionRepositoryPort
  extends RepositoryPort<Position, PositionFilter> {
  findAll(): Promise<Position[]>;
}
