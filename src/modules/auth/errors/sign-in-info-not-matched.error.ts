import { BaseError } from '@common/base/base.error';

export class SignInInfoNotMatchedError extends BaseError {
  static CODE: string = 'AUTH.SIGN_IN_INFO_NOT_MATCHED';

  constructor(message?: string) {
    super(
      message ?? 'Sign in info not matched',
      SignInInfoNotMatchedError.CODE,
    );
  }
}
