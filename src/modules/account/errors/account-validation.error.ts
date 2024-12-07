import { BaseError } from '@common/base/base.error';

export class AccountValidationError extends BaseError {
  static CODE: string = 'ACCOUNT.VALIDATION_ERROR';

  constructor(message?: string) {
    super(message ?? 'Account validation error', AccountValidationError.CODE);
  }
}
