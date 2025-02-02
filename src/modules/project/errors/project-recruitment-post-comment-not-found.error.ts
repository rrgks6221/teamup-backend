import { BaseError } from '@common/base/base.error';

export class ProjectRecruitmentPostCommentNotFoundError extends BaseError {
  static CODE: string = 'PROJECT.RECRUITMENT_POST_COMMENT_NOT_FOUND';

  constructor(message?: string) {
    super(
      message ?? 'Project recruitment post comment not found',
      ProjectRecruitmentPostCommentNotFoundError.CODE,
    );
  }
}
