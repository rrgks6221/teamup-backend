import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { ProjectApplicationStatus } from '@module/project/entities/project-application.entity';
import { ChangeProjectApplicationStatusCommand } from '@module/project/use-cases/change-project-application-status/change-project-application-status.command';

import { generateEntityId } from '@common/base/base.entity';

export const ChangeProjectApplicationStatusCommandFactory =
  Factory.define<ChangeProjectApplicationStatusCommand>(
    ChangeProjectApplicationStatusCommand.name,
    ChangeProjectApplicationStatusCommand,
  ).attrs({
    currentUserId: () => generateEntityId(),
    projectId: () => generateEntityId(),
    applicationId: () => generateEntityId(),
    status: () =>
      faker.helpers.arrayElement([
        ProjectApplicationStatus.checked,
        ProjectApplicationStatus.approved,
        ProjectApplicationStatus.rejected,
      ]),
  });
