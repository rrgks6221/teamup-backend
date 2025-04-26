import { BaseError } from '@common/base/base.error';

export class ProjectInvitationNotFoundError extends BaseError {
  static CODE: string = 'PROJECT.INVITATION_NOT_FOUND';

  constructor(message?: string) {
    super(
      message ?? 'Project invitation not found',
      ProjectInvitationNotFoundError.CODE,
    );
  }
}
