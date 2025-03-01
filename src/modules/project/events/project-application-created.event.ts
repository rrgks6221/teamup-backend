import { ProjectApplicationStatus } from '@module/project/entities/project-application.entity';

import { DomainEvent } from '@common/base/base.domain-event';

interface ProjectApplicationCreatedEventPayload {
  projectId: string;
  applicantId: string;
  position: string;
  status: ProjectApplicationStatus;
}

export class ProjectApplicationCreatedEvent extends DomainEvent<ProjectApplicationCreatedEventPayload> {
  readonly aggregate = 'Project';
}
