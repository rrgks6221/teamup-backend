import { ProjectInvitation as ProjectInvitationModel } from '@prisma/client';

import {
  ProjectInvitation,
  ProjectInvitationStatus,
} from '@module/project/entities/project-invitation.entity';

import { RepositoryPort } from '@common/base/base.repository';

export const PROJECT_INVITATION_REPOSITORY = Symbol(
  'PROJECT_INVITATION_REPOSITORY',
);

export interface ProjectInvitationRaw extends ProjectInvitationModel {}

export interface ProjectInvitationFilter {
  projectId?: string;
  statuses?: Set<ProjectInvitationStatus>;
}

export interface ProjectInvitationOrder extends Record<never, 'desc' | 'asc'> {}

export interface ProjectInvitationRepositoryPort
  extends RepositoryPort<
    ProjectInvitation,
    ProjectInvitationFilter,
    ProjectInvitationOrder
  > {
  findByProjectInvitee(
    projectId: string,
    inviteeId: string,
  ): Promise<ProjectInvitation[]>;
}
