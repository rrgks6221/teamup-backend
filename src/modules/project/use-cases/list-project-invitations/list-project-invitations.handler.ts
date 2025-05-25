import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ProjectInvitation } from '@module/project/entities/project-invitation.entity';
import { ProjectInvitationViewRestrictedError } from '@module/project/errors/project-invitation-view-restricted.error';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import {
  PROJECT_INVITATION_REPOSITORY,
  ProjectInvitationRepositoryPort,
} from '@module/project/repositories/project-invitation.repository.port';
import {
  PROJECT_MEMBER_REPOSITORY,
  ProjectMemberRepositoryPort,
} from '@module/project/repositories/project-member.repository.port';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';
import { ListProjectInvitationsQuery } from '@module/project/use-cases/list-project-invitations/list-project-invitations.query';

import { ICursorPaginated } from '@common/base/base.repository';

@QueryHandler(ListProjectInvitationsQuery)
export class ListProjectInvitationsHandler
  implements
    IQueryHandler<
      ListProjectInvitationsQuery,
      ICursorPaginated<ProjectInvitation>
    >
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositoryPort,
    @Inject(PROJECT_MEMBER_REPOSITORY)
    private readonly projectMemberRepository: ProjectMemberRepositoryPort,
    @Inject(PROJECT_INVITATION_REPOSITORY)
    private readonly projectInvitationRepository: ProjectInvitationRepositoryPort,
  ) {}

  async execute(
    query: ListProjectInvitationsQuery,
  ): Promise<ICursorPaginated<ProjectInvitation>> {
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
      throw new ProjectInvitationViewRestrictedError(
        'Only project manager can view project invitation',
      );
    }

    const { cursor, data } =
      await this.projectInvitationRepository.findAllCursorPaginated({
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
