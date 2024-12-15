import { BaseError } from '@common/base/base.error';

export class ProjectMemberAlreadyExistsError extends BaseError {
  static CODE: string = 'PROJECT.MEMBER_ALREADY_EXISTS';

  constructor(message?: string) {
    super(
      message ?? 'Project member already exists',
      ProjectMemberAlreadyExistsError.CODE,
    );
  }
}
