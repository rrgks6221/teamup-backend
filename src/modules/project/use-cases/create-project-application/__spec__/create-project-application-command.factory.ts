import { Factory } from 'rosie';

import { CreateProjectApplicationCommand } from '@module/project/use-cases/create-project-application/create-project-application.command';

import { generateEntityId } from '@common/base/base.entity';

export const CreateProjectApplicationCommandFactory =
  Factory.define<CreateProjectApplicationCommand>(
    CreateProjectApplicationCommand.name,
    CreateProjectApplicationCommand,
  ).attrs({
    projectId: () => generateEntityId(),
    applicantId: () => generateEntityId(),
    positionName: () => generateEntityId(),
  });
