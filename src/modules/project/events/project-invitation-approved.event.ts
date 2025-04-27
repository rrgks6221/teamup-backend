import { DomainEvent } from '@common/base/base.domain-event';

interface ProjectInvitationApprovedEventPayload {
  projectId: string;
  invitationId: string;
  inviterId: string;
  inviteeId: string;
  positionName: string;
}

export class ProjectInvitationApprovedEvent extends DomainEvent<ProjectInvitationApprovedEventPayload> {
  readonly aggregate = 'Project';
}
