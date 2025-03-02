import { BaseError } from '@common/base/base.error';

export class ProjectApplicationChangeStatusRestrictedError extends BaseError {
  static CODE: string = 'PROJECT.APPLICATION_CHANGE_STATUS_RESTRICTED';

  constructor(message?: string) {
    super(
      message ?? 'Restricting the change status of project application',
      ProjectApplicationChangeStatusRestrictedError.CODE,
    );
  }
}
