import { Factory } from 'rosie';

import { ProjectApplicationStatus } from '@module/project/entities/project-application.entity';
import { CancelProjectApplicationCommand } from '@module/project/use-cases/cancel-project-application/cancel-project-application.command';

import { generateEntityId } from '@common/base/base.entity';

export const CancelProjectApplicationCommandFactory =
  Factory.define<CancelProjectApplicationCommand>(
    CancelProjectApplicationCommand.name,
    CancelProjectApplicationCommand,
  ).attrs({
    currentUserId: () => generateEntityId(),
    projectId: () => generateEntityId(),
    applicationId: () => generateEntityId(),
    status: () => ProjectApplicationStatus.canceled,
  });
