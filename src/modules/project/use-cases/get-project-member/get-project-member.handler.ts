import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ProjectMember } from '@module/project/entities/project-member.entity';
import { ProjectMemberNotFoundError } from '@module/project/errors/project-member-not-found.error copy';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import {
  PROJECT_MEMBER_REPOSITORY,
  ProjectMemberRepositoryPort,
} from '@module/project/repositories/project-member.repository.port';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';
import { GetProjectMemberQuery } from '@module/project/use-cases/get-project-member/get-project-member.query';

@QueryHandler(GetProjectMemberQuery)
export class GetProjectMemberHandler
  implements IQueryHandler<GetProjectMemberQuery, ProjectMember>
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositoryPort,
    @Inject(PROJECT_MEMBER_REPOSITORY)
    private readonly projectMemberRepository: ProjectMemberRepositoryPort,
  ) {}

  async execute(query: GetProjectMemberQuery): Promise<ProjectMember> {
    const [project, projectMember] = await Promise.all([
      this.projectRepository.findOneById(query.projectId),
      this.projectMemberRepository.findOneById(query.memberId),
    ]);

    if (project === undefined) {
      throw new ProjectNotFoundError();
    }

    if (projectMember === undefined) {
      throw new ProjectMemberNotFoundError();
    }

    return projectMember;
  }
}
