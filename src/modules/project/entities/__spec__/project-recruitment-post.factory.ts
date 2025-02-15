import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import {
  ProjectRecruitmentPost,
  ProjectRecruitmentPostProps,
  ProjectRecruitmentPostStatus,
} from '@module/project/entities/project-recruitment-post.entity';

import { generateEntityId } from '@common/base/base.entity';

export const ProjectRecruitmentPostFactory = Factory.define<
  ProjectRecruitmentPost & ProjectRecruitmentPostProps
>(ProjectRecruitmentPost.name)
  .attrs({
    id: () => generateEntityId(),
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
    projectId: () => generateEntityId(),
    authorId: () => generateEntityId(),
    title: () => faker.string.alpha(),
    description: () => faker.string.alpha(),
    position: () => faker.string.alpha(),
    techStackNames: () => [],
    recruitmentStatus: () =>
      faker.helpers.enumValue(ProjectRecruitmentPostStatus),
    maxRecruitsCount: () => 99,
    currentRecruitsCount: () => 0,
    applicantsEndsAt: () => new Date(),
    applicantsCount: () => 0,
    commentsCount: () => 0,
  })
  .after(
    ({ id, createdAt, updatedAt, ...props }) =>
      new ProjectRecruitmentPost({ id, createdAt, updatedAt, props }),
  );
