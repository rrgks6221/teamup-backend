import { Factory } from 'rosie';

import { ProjectInvitationStatus } from '@module/project/entities/project-invitation.entity';
import { ApproveProjectInvitationCommand } from '@module/project/use-cases/approve-project-invitation/approve-project-invitation.command';

import { generateEntityId } from '@common/base/base.entity';

export const ApproveProjectInvitationCommandFactory =
  Factory.define<ApproveProjectInvitationCommand>(
    ApproveProjectInvitationCommand.name,
    ApproveProjectInvitationCommand,
  ).attrs({
    currentUserId: () => generateEntityId(),
    projectId: () => generateEntityId(),
    invitationId: () => generateEntityId(),
    status: () => ProjectInvitationStatus.approved,
  });
