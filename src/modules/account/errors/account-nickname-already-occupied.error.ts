import { BaseError } from '@common/base/base.error';

export class AccountNicknameAlreadyOccupiedError extends BaseError {
  static CODE: string = 'ACCOUNT.NICKNAME_ALREADY_OCCUPIED';

  constructor(message?: string) {
    super(
      message ?? 'Account nickname is already occupied',
      AccountNicknameAlreadyOccupiedError.CODE,
    );
  }
}
