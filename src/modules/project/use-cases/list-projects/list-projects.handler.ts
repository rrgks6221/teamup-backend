import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Project } from '@module/project/entities/project.entity';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';
import { ListProjectsQuery } from '@module/project/use-cases/list-projects/list-projects.query';

import { ICursorPaginated } from '@common/base/base.repository';

@QueryHandler(ListProjectsQuery)
export class ListProjectsHandler
  implements IQueryHandler<ListProjectsQuery, ICursorPaginated<Project>>
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositoryPort,
  ) {}

  async execute(query: ListProjectsQuery): Promise<ICursorPaginated<Project>> {
    const { cursor, data } =
      await this.projectRepository.findAllCursorPaginated({
        cursor: query.cursor,
        limit: query.limit,
        filter: {
          statuses:
            query.statuses === undefined ? undefined : new Set(query.statuses),
        },
      });

    return {
      data,
      cursor,
    };
  }
}
