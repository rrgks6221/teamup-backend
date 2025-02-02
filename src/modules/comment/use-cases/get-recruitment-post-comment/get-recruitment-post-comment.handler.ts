import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Comment } from '@module/comment/entities/comment.entity';
import {
  COMMENT_REPOSITORY,
  CommentRepositoryPort,
} from '@module/comment/repositories/comment.repository.port';
import { GetRecruitmentPostCommentQuery } from '@module/comment/use-cases/get-recruitment-post-comment/get-recruitment-post-comment.query';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectRecruitmentPostNotFoundError } from '@module/project/errors/project-recruitment-not-found.error';
import { ProjectRecruitmentPostCommentNotFoundError } from '@module/project/errors/project-recruitment-post-comment-not-found.error';
import {
  PROJECT_RECRUITMENT_POST_REPOSITORY,
  ProjectRecruitmentPostRepositoryPort,
} from '@module/project/repositories/project-recruitment-post.repository.port';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';

@QueryHandler(GetRecruitmentPostCommentQuery)
export class GetRecruitmentPostCommentHandler
  implements IQueryHandler<GetRecruitmentPostCommentQuery, Comment>
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositoryPort,
    @Inject(PROJECT_RECRUITMENT_POST_REPOSITORY)
    private readonly projectRecruitmentPostRepository: ProjectRecruitmentPostRepositoryPort,
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepositoryPort,
  ) {}

  async execute(query: GetRecruitmentPostCommentQuery): Promise<Comment> {
    const [project, post, comment] = await Promise.all([
      this.projectRepository.findOneById(query.projectId),
      this.projectRecruitmentPostRepository.findOneById(query.postId),
      this.commentRepository.findOneById(query.commentId),
    ]);

    if (project === undefined) {
      throw new ProjectNotFoundError();
    }

    if (post === undefined) {
      throw new ProjectRecruitmentPostNotFoundError();
    }

    if (comment === undefined) {
      throw new ProjectRecruitmentPostCommentNotFoundError();
    }

    return comment;
  }
}
