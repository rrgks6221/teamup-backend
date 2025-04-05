import { DomainEvent } from '@common/base/base.domain-event';

interface ProjectApplicationCanceledEventPayload {
  projectId: string;
  applicationId: string;
  applicantId: string;
  positionName: string;
}

export class ProjectApplicationCanceledEvent extends DomainEvent<ProjectApplicationCanceledEventPayload> {
  readonly aggregate = 'Project';
}
