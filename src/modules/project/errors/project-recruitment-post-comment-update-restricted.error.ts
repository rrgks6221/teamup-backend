import { BaseError } from '@common/base/base.error';

export class ProjectRecruitmentPostCommentUpdateRestrictedError extends BaseError {
  static CODE: string = 'PROJECT.RECRUITMENT_POST_COMMENT_UPDATE_RESTRICTED';

  constructor(message?: string) {
    super(
      message ?? 'Restricting the update Project recruitment post comment',
      ProjectRecruitmentPostCommentUpdateRestrictedError.CODE,
    );
  }
}
