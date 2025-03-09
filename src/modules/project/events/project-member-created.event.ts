import { ProjectMemberRole } from '@module/project/entities/project-member.entity';

import { DomainEvent } from '@common/base/base.domain-event';

interface ProjectMemberCreatedEventPayload {
  accountId: string;
  projectId: string;
  positionName?: string;
  role: ProjectMemberRole;
  name: string;
  profileImagePath?: string;
  techStackNames?: string[];
}

export class ProjectMemberCreatedEvent extends DomainEvent<ProjectMemberCreatedEventPayload> {
  readonly aggregate = 'Project';
}
