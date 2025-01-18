import { ProjectRecruitmentPost as ProjectRecruitmentPostModel } from '@prisma/client';

import { ProjectRecruitmentPost } from '@module/project/entities/project-recruitment-post.entity';

import { RepositoryPort } from '@common/base/base.repository';

export const PROJECT_RECRUITMENT_POST_REPOSITORY = Symbol(
  'PROJECT_RECRUITMENT_POST_REPOSITORY',
);

export interface ProjectRecruitmentPostRaw
  extends ProjectRecruitmentPostModel {}

export interface ProjectRecruitmentPostFilter {}

export interface ProjectRecruitmentPostRepositoryPort
  extends RepositoryPort<
    ProjectRecruitmentPost,
    ProjectRecruitmentPostFilter
  > {}
