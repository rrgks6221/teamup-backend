import { Factory } from 'rosie';

import { ProjectApplicationStatus } from '@module/project/entities/project-application.entity';
import { CheckProjectApplicationCommand } from '@module/project/use-cases/check-project-application/check-project-application.command';

import { generateEntityId } from '@common/base/base.entity';

export const CheckProjectApplicationCommandFactory =
  Factory.define<CheckProjectApplicationCommand>(
    CheckProjectApplicationCommand.name,
    CheckProjectApplicationCommand,
  ).attrs({
    currentUserId: () => generateEntityId(),
    projectId: () => generateEntityId(),
    applicationId: () => generateEntityId(),
    status: () => ProjectApplicationStatus.checked,
  });
