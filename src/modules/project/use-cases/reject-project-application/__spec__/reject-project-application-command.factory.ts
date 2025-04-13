import { Factory } from 'rosie';

import { ProjectApplicationStatus } from '@module/project/entities/project-application.entity';
import { RejectProjectApplicationCommand } from '@module/project/use-cases/reject-project-application/reject-project-application.command';

import { generateEntityId } from '@common/base/base.entity';

export const RejectProjectApplicationCommandFactory =
  Factory.define<RejectProjectApplicationCommand>(
    RejectProjectApplicationCommand.name,
    RejectProjectApplicationCommand,
  ).attrs({
    currentUserId: () => generateEntityId(),
    projectId: () => generateEntityId(),
    applicationId: () => generateEntityId(),
    status: () => ProjectApplicationStatus.rejected,
  });
