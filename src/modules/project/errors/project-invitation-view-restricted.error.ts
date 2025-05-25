import { BaseError } from '@common/base/base.error';

export class ProjectInvitationViewRestrictedError extends BaseError {
  static CODE: string = 'PROJECT.INVITATION_VIEW_RESTRICTED';

  constructor(message?: string) {
    super(
      message ?? 'Restricting the view of project invitation',
      ProjectInvitationViewRestrictedError.CODE,
    );
  }
}
