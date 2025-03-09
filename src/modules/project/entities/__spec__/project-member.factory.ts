import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import {
  ProjectMember,
  ProjectMemberProps,
  ProjectMemberRole,
} from '@module/project/entities/project-member.entity';

import { generateEntityId } from '@common/base/base.entity';

export const ProjectMemberFactory = Factory.define<
  ProjectMember & ProjectMemberProps
>(ProjectMember.name)
  .attrs({
    id: () => generateEntityId(),
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
    accountId: () => generateEntityId(),
    projectId: () => generateEntityId(),
    positionName: () => faker.string.alpha(),
    role: () => faker.helpers.enumValue(ProjectMemberRole),
    name: () => faker.string.alpha(),
    profileImagePath: () => faker.string.nanoid(),
    techStackNames: () => [],
  })
  .after(
    ({ id, createdAt, updatedAt, ...props }) =>
      new ProjectMember({ id, createdAt, updatedAt, props }),
  );
