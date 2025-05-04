import { Factory } from 'rosie';

import { ProjectInvitationStatus } from '@module/project/entities/project-invitation.entity';
import { CancelProjectInvitationCommand } from '@module/project/use-cases/cancel-project-invitation/cancel-project-invitation.command';

import { generateEntityId } from '@common/base/base.entity';

export const CancelProjectInvitationCommandFactory =
  Factory.define<CancelProjectInvitationCommand>(
    CancelProjectInvitationCommand.name,
    CancelProjectInvitationCommand,
  ).attrs({
    currentUserId: () => generateEntityId(),
    projectId: () => generateEntityId(),
    invitationId: () => generateEntityId(),
    status: () => ProjectInvitationStatus.canceled,
  });
