import { DomainEvent } from '@common/base/base.domain-event';

interface ProjectApplicationRejectedEventPayload {
  projectId: string;
  applicationId: string;
  applicantId: string;
}

export class ProjectApplicationRejectedEvent extends DomainEvent<ProjectApplicationRejectedEventPayload> {
  readonly aggregate = 'Project';
}
