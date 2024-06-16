import { BaseError } from '@common/base/base.error';

export class PermissionDeniedError extends BaseError {
  static CODE = 'AUTH.PERMISSION_DENIED';

  constructor(message?: string) {
    super(message ?? 'User permission Denied', PermissionDeniedError.CODE);
  }
}
