import { BaseError } from '@common/base/base.error';

export class ProjectApplicationValidationError extends BaseError {
  static CODE: string = 'PROJECT.APPLICATION_VALIDATION_ERROR';

  constructor(message?: string) {
    super(
      message ?? 'Project application validation error',
      ProjectApplicationValidationError.CODE,
    );
  }
}
