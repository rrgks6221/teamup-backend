import { DomainEvent } from '@common/base/base.domain-event';

interface ProjectInvitationCanceledEventPayload {
  projectId: string;
  invitationId: string;
  inviterId: string;
  inviteeId: string;
}

export class ProjectInvitationCanceledEvent extends DomainEvent<ProjectInvitationCanceledEventPayload> {
  readonly aggregate = 'Project';
}
