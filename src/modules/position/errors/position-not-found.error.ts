import { BaseError } from '@common/base/base.error';

export class PositionNotFoundError extends BaseError {
  static CODE = 'POSITION.NOT_FOUND';

  constructor(message?: string) {
    super(message ?? 'Position not found', PositionNotFoundError.CODE);
  }
}
