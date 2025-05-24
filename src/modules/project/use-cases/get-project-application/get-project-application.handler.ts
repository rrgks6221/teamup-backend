import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ProjectApplication } from '@module/project/entities/project-application.entity';
import { ProjectApplicationNotFoundError } from '@module/project/errors/project-application-not-found.error';
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
import { GetProjectApplicationQuery } from '@module/project/use-cases/get-project-application/get-project-application.query';

@QueryHandler(GetProjectApplicationQuery)
export class GetProjectApplicationHandler
  implements IQueryHandler<GetProjectApplicationQuery, ProjectApplication>
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
    query: GetProjectApplicationQuery,
  ): Promise<ProjectApplication> {
    const [project, application, currentMember] = await Promise.all([
      this.projectRepository.findOneById(query.projectId),
      this.projectApplicationRepository.findOneById(query.applicationId),
      this.projectMemberRepository.findOneByAccountInProject(
        query.projectId,
        query.currentUserId,
      ),
    ]);

    if (project === undefined) {
      throw new ProjectNotFoundError();
    }

    if (application === undefined) {
      throw new ProjectApplicationNotFoundError();
    }

    if (currentMember === undefined || currentMember.isManager() === false) {
      throw new ProjectApplicationViewRestrictedError(
        'Only project manager can view project application',
      );
    }

    return application;
  }
}
