import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Project } from '@module/project/entities/project.entity';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';
import { GetProjectQuery } from '@module/project/use-cases/get-project/get-project.query';

@QueryHandler(GetProjectQuery)
export class GetProjectHandler
  implements IQueryHandler<GetProjectQuery, Project>
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositoryPort,
  ) {}

  async execute(query: GetProjectQuery): Promise<Project> {
    const project = await this.projectRepository.findOneById(query.projectId);

    if (project === undefined) {
      throw new ProjectNotFoundError();
    }

    return project;
  }
}
