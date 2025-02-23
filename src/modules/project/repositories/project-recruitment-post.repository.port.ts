import { ProjectRecruitmentPost as ProjectRecruitmentPostModel } from '@prisma/client';

import { ProjectRecruitmentPost } from '@module/project/entities/project-recruitment-post.entity';

import { EntityId } from '@common/base/base.entity';
import { RepositoryPort } from '@common/base/base.repository';

export const PROJECT_RECRUITMENT_POST_REPOSITORY = Symbol(
  'PROJECT_RECRUITMENT_POST_REPOSITORY',
);

export interface ProjectRecruitmentPostRaw
  extends ProjectRecruitmentPostModel {}

export interface ProjectRecruitmentPostFilter {
  projectId?: string;
}

export interface ProjectRecruitmentPostOrder
  extends Record<never, 'desc' | 'asc'> {}

export interface ProjectRecruitmentPostRepositoryPort
  extends RepositoryPort<
    ProjectRecruitmentPost,
    ProjectRecruitmentPostFilter,
    ProjectRecruitmentPostOrder
  > {
  incrementCommentsCount(projectId: EntityId): Promise<number>;
  decrementCommentsCount(projectId: EntityId): Promise<number>;
  incrementViewCount(projectId: EntityId): Promise<number>;
}
