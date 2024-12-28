import { BaseError } from '@common/base/base.error';

export class ProjectMemberDeletionRestrictedError extends BaseError {
  static CODE: string = 'PROJECT.MEMBER_DELETION_RESTRICTED';

  constructor(message?: string) {
    super(
      message ?? 'Member cannot be deleted from the project',
      ProjectMemberDeletionRestrictedError.CODE,
    );
  }
}
