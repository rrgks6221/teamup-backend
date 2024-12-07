import { BaseError } from '@common/base/base.error';

export class AccountUsernameAlreadyOccupiedError extends BaseError {
  static CODE: string = 'ACCOUNT.USERNAME_ALREADY_OCCUPIED';

  constructor(message?: string) {
    super(
      message ?? 'Account username is already occupied',
      AccountUsernameAlreadyOccupiedError.CODE,
    );
  }
}
