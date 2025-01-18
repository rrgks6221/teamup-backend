import { BaseError } from '@common/base/base.error';

export class ProjectRecruitmentPostCreationRestrictedError extends BaseError {
  static CODE: string = 'PROJECT.RECRUITMENT_POST_CREATION_RESTRICTED';

  constructor(message?: string) {
    super(
      message ?? 'Restricting the creation of project recruitment posts',
      ProjectRecruitmentPostCreationRestrictedError.CODE,
    );
  }
}
