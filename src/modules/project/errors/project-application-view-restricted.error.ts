import { BaseError } from '@common/base/base.error';

export class ProjectApplicationViewRestrictedError extends BaseError {
  static CODE: string = 'PROJECT.APPLICATION_VIEW_RESTRICTED';

  constructor(message?: string) {
    super(
      message ?? 'Restricting the view of project application',
      ProjectApplicationViewRestrictedError.CODE,
    );
  }
}
