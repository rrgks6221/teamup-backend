import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import {
  Project,
  ProjectProps,
  ProjectStatus,
} from '@module/project/entities/project.entity';

import { generateEntityId } from '@common/base/base.entity';

export const ProjectFactory = Factory.define<Project & ProjectProps>(
  Project.name,
)
  .attrs({
    id: () => generateEntityId(),
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
    ownerId: () => generateEntityId(),
    name: () => faker.string.alpha(),
    description: () => faker.string.alpha(),
    status: () => faker.helpers.enumValue(ProjectStatus),
    category: () => faker.string.alpha(),
    maxMemberCount: () => 0,
    currentMemberCount: () => 0,
    tags: () => [],
  })
  .after(
    ({ id, createdAt, updatedAt, ...props }) =>
      new Project({ id, createdAt, updatedAt, props }),
  );
