import { Factory } from 'rosie';

import { ProjectApplicationStatus } from '@module/project/entities/project-application.entity';
import { ApproveProjectApplicationCommand } from '@module/project/use-cases/approve-project-application/approve-project-application.command';

import { generateEntityId } from '@common/base/base.entity';

export const ApproveProjectApplicationCommandFactory =
  Factory.define<ApproveProjectApplicationCommand>(
    ApproveProjectApplicationCommand.name,
    ApproveProjectApplicationCommand,
  ).attrs({
    currentUserId: () => generateEntityId(),
    projectId: () => generateEntityId(),
    applicationId: () => generateEntityId(),
    status: () => ProjectApplicationStatus.approved,
  });
