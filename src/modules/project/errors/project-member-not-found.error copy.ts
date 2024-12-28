import { BaseError } from '@common/base/base.error';

export class ProjectMemberNotFoundError extends BaseError {
  static CODE: string = 'PROJECT.MEMBER_NOT_FOUND';

  constructor(message?: string) {
    super(
      message ?? 'Project member not found',
      ProjectMemberNotFoundError.CODE,
    );
  }
}
