import { DomainEvent } from '@common/base/base.domain-event';

interface ProjectApplicationApprovedEventPayload {
  projectId: string;
  applicationId: string;
  applicantId: string;
  position: string;
}

export class ProjectApplicationApprovedEvent extends DomainEvent<ProjectApplicationApprovedEventPayload> {
  readonly aggregate = 'Project';
}
