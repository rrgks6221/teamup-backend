import { ProjectMember as ProjectMemberModel } from '@prisma/client';

import { ProjectMember } from '@module/project/entities/project-member.entity';

import { EntityId } from '@common/base/base.entity';
import { RepositoryPort } from '@common/base/base.repository';

export const PROJECT_MEMBER_REPOSITORY = Symbol('PROJECT_MEMBER_REPOSITORY');

export interface ProjectMemberRaw extends ProjectMemberModel {}

export interface ProjectMemberFilter {
  projectId?: string;
}

export interface ProjectMemberOrder extends Record<never, 'desc' | 'asc'> {}

export interface ProjectMemberRepositoryPort
  extends RepositoryPort<
    ProjectMember,
    ProjectMemberFilter,
    ProjectMemberOrder
  > {
  findOneByAccountInProject(
    projectId: EntityId,
    accountId: EntityId,
  ): Promise<ProjectMember | undefined>;
}
