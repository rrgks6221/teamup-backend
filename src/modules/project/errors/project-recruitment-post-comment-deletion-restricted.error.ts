import { BaseError } from '@common/base/base.error';

export class ProjectRecruitmentPostCommentDeletionRestrictedError extends BaseError {
  static CODE: string = 'PROJECT.RECRUITMENT_POST_COMMENT_DELETION_RESTRICTED';

  constructor(message?: string) {
    super(
      message ?? 'Restricting the deletion Project recruitment post comment',
      ProjectRecruitmentPostCommentDeletionRestrictedError.CODE,
    );
  }
}
