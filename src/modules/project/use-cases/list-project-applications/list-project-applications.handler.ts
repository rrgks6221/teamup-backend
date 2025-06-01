import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ProjectApplication } from '@module/project/entities/project-application.entity';
import { ProjectApplicationViewRestrictedError } from '@module/project/errors/project-application-view-restricted.error';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import {
  PROJECT_APPLICATION_REPOSITORY,
  ProjectApplicationRepositoryPort,
} from '@module/project/repositories/project-application.repository.port';
import {
  PROJECT_MEMBER_REPOSITORY,
  ProjectMemberRepositoryPort,
} from '@module/project/repositories/project-member.repository.port';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';
import { ListProjectApplicationsQuery } from '@module/project/use-cases/list-project-applications/list-project-applications.query';

import { ICursorPaginated } from '@common/base/base.repository';

@QueryHandler(ListProjectApplicationsQuery)
export class ListProjectApplicationsHandler
  implements
    IQueryHandler<
      ListProjectApplicationsQuery,
      ICursorPaginated<ProjectApplication>
    >
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositoryPort,
    @Inject(PROJECT_MEMBER_REPOSITORY)
    private readonly projectMemberRepository: ProjectMemberRepositoryPort,
    @Inject(PROJECT_APPLICATION_REPOSITORY)
    private readonly projectApplicationRepository: ProjectApplicationRepositoryPort,
  ) {}

  async execute(
    query: ListProjectApplicationsQuery,
  ): Promise<ICursorPaginated<ProjectApplication>> {
    const [project, currentMember] = await Promise.all([
      this.projectRepository.findOneById(query.projectId),
      this.projectMemberRepository.findOneByAccountInProject(
        query.projectId,
        query.currentUserId,
      ),
    ]);

    if (project === undefined) {
      throw new ProjectNotFoundError();
    }

    if (currentMember === undefined || currentMember.isManager() === false) {
      throw new ProjectApplicationViewRestrictedError(
        'Only project manager can view project application',
      );
    }

    const { cursor, data } =
      await this.projectApplicationRepository.findAllCursorPaginated({
        cursor: query.cursor,
        limit: query.limit,
        filter: {
          projectId: query.projectId,
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
