import { DomainEvent } from '@common/base/base.domain-event';

interface ProjectApplicationMarkAsCheckedEventPayload {
  projectId: string;
  applicationId: string;
  applicantId: string;
}

export class ProjectApplicationMarkAsCheckedEvent extends DomainEvent<ProjectApplicationMarkAsCheckedEventPayload> {
  readonly aggregate = 'Project';
}
