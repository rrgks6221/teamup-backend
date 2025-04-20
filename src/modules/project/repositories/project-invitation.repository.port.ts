import { ProjectInvitation as ProjectInvitationModel } from '@prisma/client';

import { ProjectInvitation } from '@module/project/entities/project-invitation.entity';

import { RepositoryPort } from '@common/base/base.repository';

export const PROJECT_INVITATION_REPOSITORY = Symbol(
  'PROJECT_INVITATION_REPOSITORY',
);

export interface ProjectInvitationRaw extends ProjectInvitationModel {}

export interface ProjectInvitationFilter {}

export interface ProjectInvitationRepositoryPort
  extends RepositoryPort<ProjectInvitation, ProjectInvitationFilter> {
  findByProjectInvitee(
    projectId: string,
    inviteeId: string,
  ): Promise<ProjectInvitation[]>;
}
