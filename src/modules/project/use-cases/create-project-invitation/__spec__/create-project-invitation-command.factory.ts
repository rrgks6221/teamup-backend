import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { CreateProjectInvitationCommand } from '@module/project/use-cases/create-project-invitation/create-project-invitation.command';

import { generateEntityId } from '@common/base/base.entity';

export const CreateProjectInvitationCommandFactory =
  Factory.define<CreateProjectInvitationCommand>(
    CreateProjectInvitationCommand.name,
    CreateProjectInvitationCommand,
  ).attrs({
    projectId: () => generateEntityId(),
    inviterId: () => generateEntityId(),
    inviteeId: () => generateEntityId(),
    positionName: () => faker.string.alpha(),
  });
