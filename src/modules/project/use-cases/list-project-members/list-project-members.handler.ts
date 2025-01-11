import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ProjectMember } from '@module/project/entities/project-member.entity';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import {
  PROJECT_MEMBER_REPOSITORY,
  ProjectMemberRepositoryPort,
} from '@module/project/repositories/project-member.repository.port';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';
import { ListProjectMembersQuery } from '@module/project/use-cases/list-project-members/list-project-members.query';

import { ICursorPaginated } from '@common/base/base.repository';

@QueryHandler(ListProjectMembersQuery)
export class ListProjectMembersHandler
  implements
    IQueryHandler<ListProjectMembersQuery, ICursorPaginated<ProjectMember>>
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositoryPort,
    @Inject(PROJECT_MEMBER_REPOSITORY)
    private readonly projectMemberRepository: ProjectMemberRepositoryPort,
  ) {}

  async execute(
    query: ListProjectMembersQuery,
  ): Promise<ICursorPaginated<ProjectMember>> {
    const project = await this.projectRepository.findOneById(query.projectId);

    if (project === undefined) {
      throw new ProjectNotFoundError();
    }

    const { cursor, data } =
      await this.projectMemberRepository.findAllCursorPaginated({
        cursor: query.cursor,
        limit: query.limit,
        filter: {
          projectId: query.projectId,
        },
      });

    return {
      data,
      cursor,
    };
  }
}
