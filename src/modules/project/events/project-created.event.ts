import { DomainEvent } from '@common/base/base.domain-event';

interface ProjectCreatedEventPayload {
  ownerId: string;
  name: string;
  description: string;
  status: string;
  category: string;
  maxMemberCount?: number;
  currentMemberCount: number;
  tags?: string[];
}

export class ProjectCreatedEvent extends DomainEvent<ProjectCreatedEventPayload> {
  readonly aggregate = 'Project';
}
