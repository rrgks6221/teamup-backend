import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import {
  ProjectApplication,
  ProjectApplicationProps,
  ProjectApplicationStatus,
} from '@module/project/entities/project-application.entity';

import { generateEntityId } from '@common/base/base.entity';

export const ProjectApplicationFactory = Factory.define<
  ProjectApplication & ProjectApplicationProps
>(ProjectApplication.name)
  .attrs({
    id: () => generateEntityId(),
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
    projectId: () => generateEntityId(),
    applicantId: () => generateEntityId(),
    position: () => faker.string.alpha(),
    status: () => ProjectApplicationStatus.pending,
    checkedAt: () => undefined,
    approvedAt: () => undefined,
    rejectedAt: () => undefined,
  })
  .after(
    ({ id, createdAt, updatedAt, ...props }) =>
      new ProjectApplication({ id, createdAt, updatedAt, props }),
  );
