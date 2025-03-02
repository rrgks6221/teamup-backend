import { BaseError } from '@common/base/base.error';

export class ProjectApplicationNotFoundError extends BaseError {
  static CODE: string = 'PROJECT.APPLICATION_NOT_FOUND';

  constructor(message?: string) {
    super(
      message ?? 'Project application not found',
      ProjectApplicationNotFoundError.CODE,
    );
  }
}
