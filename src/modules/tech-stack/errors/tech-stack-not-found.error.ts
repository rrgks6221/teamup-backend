import { BaseError } from '@common/base/base.error';

export class TechStackNotFoundError extends BaseError {
  static CODE = 'TECH_STACK.NOT_FOUND';

  constructor(message?: string) {
    super(message ?? 'Tech stack not found', TechStackNotFoundError.CODE);
  }
}
