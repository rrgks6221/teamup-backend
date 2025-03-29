import { ProjectApplication as ProjectApplicationModel } from '@prisma/client';

import { ProjectApplication } from '@module/project/entities/project-application.entity';

import { RepositoryPort } from '@common/base/base.repository';

export const PROJECT_APPLICATION_REPOSITORY = Symbol(
  'PROJECT_APPLICATION_REPOSITORY',
);

export interface ProjectApplicationRaw extends ProjectApplicationModel {}

export interface ProjectApplicationFilter {}

export interface ProjectApplicationRepositoryPort
  extends RepositoryPort<ProjectApplication, ProjectApplicationFilter> {
  findByProjectApplicant(
    projectId: string,
    applicantId: string,
  ): Promise<ProjectApplication[]>;
}
