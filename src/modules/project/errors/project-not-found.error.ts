import { BaseError } from '@common/base/base.error';

export class ProjectNotFoundError extends BaseError {
  static CODE: string = 'PROJECT.NOT_FOUND';

  constructor(message?: string) {
    super(message ?? 'Project not found', ProjectNotFoundError.CODE);
  }
}
