import { ProjectStatus } from '@module/project/entities/project.entity';

import { DomainEvent } from '@common/base/base.domain-event';

interface ProjectCreatedEventPayload {
  ownerId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  category: string;
  currentMemberCount: number;
  tags?: string[];
}

export class ProjectCreatedEvent extends DomainEvent<ProjectCreatedEventPayload> {
  readonly aggregate = 'Project';
}
