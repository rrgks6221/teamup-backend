import { Position } from '@module/position/entities/position.entity';

import { IBaseService } from '@common/base/base-service';

export const LIST_POSITIONS_SERVICE = Symbol('IListPositionsService');

export interface IListPositionsService extends IBaseService<void, Position[]> {}
