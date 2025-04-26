import { DomainEvent } from '@common/base/base.domain-event';

interface ProjectInvitationMarkAsCheckedEventPayload {
  projectId: string;
  invitationId: string;
  inviterId: string;
  inviteeId: string;
}

export class ProjectInvitationMarkAsCheckedEvent extends DomainEvent<ProjectInvitationMarkAsCheckedEventPayload> {
  readonly aggregate = 'Project';
}
