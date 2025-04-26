import { BaseError } from '@common/base/base.error';

export class ProjectInvitationChangeStatusRestrictedError extends BaseError {
  static CODE: string = 'PROJECT.INVITATION_CHANGE_STATUS_RESTRICTED';

  constructor(message?: string) {
    super(
      message ?? 'Restricting the change status of project invitation',
      ProjectInvitationChangeStatusRestrictedError.CODE,
    );
  }
}
