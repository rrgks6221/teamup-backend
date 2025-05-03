import { Factory } from 'rosie';

import { ProjectInvitationStatus } from '@module/project/entities/project-invitation.entity';
import { RejectProjectInvitationCommand } from '@module/project/use-cases/reject-project-invitation/reject-project-invitation.command';

import { generateEntityId } from '@common/base/base.entity';

export const RejectProjectInvitationCommandFactory =
  Factory.define<RejectProjectInvitationCommand>(
    RejectProjectInvitationCommand.name,
    RejectProjectInvitationCommand,
  ).attrs({
    currentUserId: () => generateEntityId(),
    projectId: () => generateEntityId(),
    invitationId: () => generateEntityId(),
    status: () => ProjectInvitationStatus.rejected,
  });
