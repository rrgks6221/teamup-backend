import { Project as ProjectModel } from '@prisma/client';

import { Project } from '@module/project/entities/project.entity';

import { EntityId } from '@common/base/base.entity';
import { RepositoryPort } from '@common/base/base.repository';

export const PROJECT_REPOSITORY = Symbol('PROJECT_REPOSITORY');

export interface ProjectRaw extends ProjectModel {}

export interface ProjectFilter {}

export interface ProjectRepositoryPort
  extends RepositoryPort<Project, ProjectFilter> {
  incrementMemberCount(projectId: EntityId): Promise<number>;
}
