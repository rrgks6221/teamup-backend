import { BaseError } from '@common/base/base.error';

export class TechStackAlreadyExistsError extends BaseError {
  static CODE = 'TECH_STACK.ALREADY_EXISTS';

  constructor(message?: string) {
    super(
      message ?? 'Tech stack already exists',
      TechStackAlreadyExistsError.CODE,
    );
  }
}
