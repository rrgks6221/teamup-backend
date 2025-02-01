import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Comment } from '@module/comment/entities/comment.entity';
import {
  COMMENT_REPOSITORY,
  CommentRepositoryPort,
} from '@module/comment/repositories/comment.repository.port';
import { ListRecruitmentPostCommentsQuery } from '@module/comment/use-cases/list-recruitment-post-comments/list-recruitment-post-comments.query';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectRecruitmentPostNotFoundError } from '@module/project/errors/project-recruitment-not-found.error';
import {
  PROJECT_RECRUITMENT_POST_REPOSITORY,
  ProjectRecruitmentPostRepositoryPort,
} from '@module/project/repositories/project-recruitment-post.repository.port';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';

import { ICursorPaginated } from '@common/base/base.repository';

@QueryHandler(ListRecruitmentPostCommentsQuery)
export class ListRecruitmentPostCommentsHandler
  implements
    IQueryHandler<ListRecruitmentPostCommentsQuery, ICursorPaginated<Comment>>
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositoryPort,
    @Inject(PROJECT_RECRUITMENT_POST_REPOSITORY)
    private readonly projectRecruitmentPostRepository: ProjectRecruitmentPostRepositoryPort,
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepositoryPort,
  ) {}

  async execute(
    query: ListRecruitmentPostCommentsQuery,
  ): Promise<ICursorPaginated<Comment>> {
    const [project, post] = await Promise.all([
      this.projectRepository.findOneById(query.projectId),
      this.projectRecruitmentPostRepository.findOneById(query.postId),
    ]);

    if (project === undefined) {
      throw new ProjectNotFoundError();
    }

    if (post === undefined) {
      throw new ProjectRecruitmentPostNotFoundError();
    }

    const { cursor, data } =
      await this.commentRepository.findAllCursorPaginated({
        cursor: query.cursor,
        limit: query.limit,
        filter: {
          postId: query.postId,
          postType: query.postType,
        },
      });

    return {
      cursor,
      data,
    };
  }
}
