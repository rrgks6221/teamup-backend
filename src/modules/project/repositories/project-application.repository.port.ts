import {
  ProjectApplication as ProjectApplicationModel,
  ProjectApplicationStatus,
} from '@prisma/client';

import { ProjectApplication } from '@module/project/entities/project-application.entity';

import { RepositoryPort } from '@common/base/base.repository';

export const PROJECT_APPLICATION_REPOSITORY = Symbol(
  'PROJECT_APPLICATION_REPOSITORY',
);

export interface ProjectApplicationRaw extends ProjectApplicationModel {}

export interface ProjectApplicationFilter {
  projectId?: string;
  status?: ProjectApplicationStatus;
}

export interface ProjectApplicationOrder
  extends Record<never, 'desc' | 'asc'> {}

export interface ProjectApplicationRepositoryPort
  extends RepositoryPort<
    ProjectApplication,
    ProjectApplicationFilter,
    ProjectApplicationOrder
  > {
  findByProjectApplicant(
    projectId: string,
    applicantId: string,
  ): Promise<ProjectApplication[]>;
}
