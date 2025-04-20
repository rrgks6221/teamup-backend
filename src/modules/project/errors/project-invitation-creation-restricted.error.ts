import { BaseError } from '@common/base/base.error';

export class ProjectInvitationCreationRestrictedError extends BaseError {
  static CODE: string = 'PROJECT.INVITATION_CREATION_RESTRICTED';

  constructor(message?: string) {
    super(
      message ?? 'Restricting the creation of project invitation',
      ProjectInvitationCreationRestrictedError.CODE,
    );
  }
}
