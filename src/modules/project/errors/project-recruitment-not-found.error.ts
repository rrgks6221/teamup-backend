import { BaseError } from '@common/base/base.error';

export class ProjectRecruitmentPostNotFoundError extends BaseError {
  static CODE: string = 'PROJECT.RECRUITMENT_POST_NOT_FOUND';

  constructor(message?: string) {
    super(
      message ?? 'Project recruitment post not found',
      ProjectRecruitmentPostNotFoundError.CODE,
    );
  }
}
