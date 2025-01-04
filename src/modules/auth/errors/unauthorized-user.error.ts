import { BaseError } from '@common/base/base.error';

export class UnauthorizedUserError extends BaseError {
  static CODE: string = 'AUTH.UNAUTHORIZED_USER';

  constructor(message?: string) {
    super(
      message ?? 'Unauthorized user can not access',
      UnauthorizedUserError.CODE,
    );
  }
}
