import { DomainEvent } from '@common/base/base.domain-event';

interface ProjectInvitationRejectedEventPayload {
  projectId: string;
  invitationId: string;
  inviterId: string;
  inviteeId: string;
}

export class ProjectInvitationRejectedEvent extends DomainEvent<ProjectInvitationRejectedEventPayload> {
  readonly aggregate = 'Project';
}
