import { BaseError } from '@common/base/base.error';

export class ProjectInvitationValidationError extends BaseError {
  static CODE: string = 'PROJECT.INVITATION_VALIDATION_ERROR';

  constructor(message?: string) {
    super(
      message ?? 'Project invitation validation error',
      ProjectInvitationValidationError.CODE,
    );
  }
}
