import { Project as ProjectModel, ProjectStatus } from '@prisma/client';

import { Project } from '@module/project/entities/project.entity';

import { EntityId } from '@common/base/base.entity';
import { RepositoryPort } from '@common/base/base.repository';

export const PROJECT_REPOSITORY = Symbol('PROJECT_REPOSITORY');

export interface ProjectRaw extends ProjectModel {}

export interface ProjectFilter {
  statuses?: Set<ProjectStatus>;
}

export interface ProjectOrder extends Record<'id', 'desc' | 'asc'> {}

export interface ProjectRepositoryPort
  extends RepositoryPort<Project, ProjectFilter, ProjectOrder> {
  incrementMemberCount(projectId: EntityId): Promise<number>;
  decrementMemberCount(projectId: EntityId): Promise<number>;
}
