import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ProjectRecruitmentPost } from '@module/project/entities/project-recruitment-post.entity';
import {
  PROJECT_RECRUITMENT_POST_REPOSITORY,
  ProjectRecruitmentPostRepositoryPort,
} from '@module/project/repositories/project-recruitment-post.repository.port';
import { ListProjectRecruitmentPostsQuery } from '@module/project/use-cases/list-project-recruitment-posts/list-project-recruitment-posts.query';

import { ICursorPaginated } from '@common/base/base.repository';

@QueryHandler(ListProjectRecruitmentPostsQuery)
export class ListProjectRecruitmentPostsHandler
  implements
    IQueryHandler<
      ListProjectRecruitmentPostsQuery,
      ICursorPaginated<ProjectRecruitmentPost>
    >
{
  constructor(
    @Inject(PROJECT_RECRUITMENT_POST_REPOSITORY)
    private readonly projectRecruitmentPostRepository: ProjectRecruitmentPostRepositoryPort,
  ) {}

  async execute(
    query: ListProjectRecruitmentPostsQuery,
  ): Promise<ICursorPaginated<ProjectRecruitmentPost>> {
    const { cursor, data } =
      await this.projectRecruitmentPostRepository.findAllCursorPaginated({
        cursor: query.cursor,
        limit: query.limit,
        filter: {
          projectId: query.projectId,
        },
      });

    return {
      cursor,
      data,
    };
  }
}
