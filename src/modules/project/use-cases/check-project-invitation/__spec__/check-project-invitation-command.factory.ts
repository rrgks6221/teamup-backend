import { Factory } from 'rosie';

import { ProjectInvitationStatus } from '@module/project/entities/project-invitation.entity';
import { CheckProjectInvitationCommand } from '@module/project/use-cases/check-project-invitation/check-project-invitation.command';

import { generateEntityId } from '@common/base/base.entity';

export const CheckProjectInvitationCommandFactory =
  Factory.define<CheckProjectInvitationCommand>(
    CheckProjectInvitationCommand.name,
    CheckProjectInvitationCommand,
  ).attrs({
    currentUserId: () => generateEntityId(),
    projectId: () => generateEntityId(),
    invitationId: () => generateEntityId(),
    status: () => ProjectInvitationStatus.checked,
  });
