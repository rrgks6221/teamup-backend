import { ProjectInvitationStatus } from '@module/project/entities/project-invitation.entity';

import { DomainEvent } from '@common/base/base.domain-event';

interface ProjectApplicationInvitationEventPayload {
  projectId: string;
  inviterId: string;
  inviteeId: string;
  positionName: string;
  status: ProjectInvitationStatus;
}

export class ProjectInvitationCreatedEvent extends DomainEvent<ProjectApplicationInvitationEventPayload> {
  readonly aggregate = 'Project';
}
