import { BaseError } from '@common/base/base.error';

export class PositionAlreadyExistsError extends BaseError {
  static CODE = 'POSITION.ALREADY_EXISTS';

  constructor(message?: string) {
    super(
      message ?? 'Position already exists',
      PositionAlreadyExistsError.CODE,
    );
  }
}
