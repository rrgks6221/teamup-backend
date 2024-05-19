import { BaseError } from '@common/base/base.error';

export class AccountNotFoundError extends BaseError {
  static CODE: string = 'ACCOUNT.NOT_FOUND';

  constructor(message?: string) {
    super(message ?? 'Account not found', AccountNotFoundError.CODE);
  }
}
