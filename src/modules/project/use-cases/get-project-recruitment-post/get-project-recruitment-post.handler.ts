import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ProjectRecruitmentPost } from '@module/project/entities/project-recruitment-post.entity';
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
import { GetProjectRecruitmentPostQuery } from '@module/project/use-cases/get-project-recruitment-post/get-project-recruitment-post.query';

@QueryHandler(GetProjectRecruitmentPostQuery)
export class GetProjectRecruitmentPostHandler
  implements
    IQueryHandler<GetProjectRecruitmentPostQuery, ProjectRecruitmentPost>
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositoryPort,
    @Inject(PROJECT_RECRUITMENT_POST_REPOSITORY)
    private readonly projectRecruitmentPostRepository: ProjectRecruitmentPostRepositoryPort,
  ) {}

  async execute(
    query: GetProjectRecruitmentPostQuery,
  ): Promise<ProjectRecruitmentPost> {
    if (query.projectId !== undefined) {
      const project = await this.projectRepository.findOneById(query.projectId);

      if (project === undefined) {
        throw new ProjectNotFoundError();
      }
    }

    const projectRecruitmentPost =
      await this.projectRecruitmentPostRepository.findOneById(
        query.projectRecruitmentPostId,
      );

    if (projectRecruitmentPost === undefined) {
      throw new ProjectRecruitmentPostNotFoundError();
    }

    return projectRecruitmentPost;
  }
}
