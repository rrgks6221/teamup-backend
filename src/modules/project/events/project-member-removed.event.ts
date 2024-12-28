import { DomainEvent } from '@common/base/base.domain-event';

interface ProjectMemberRemovedEventPayload {
  accountId: string;
  projectId: string;
  memberId: string;
}

export class ProjectMemberRemovedEvent extends DomainEvent<ProjectMemberRemovedEventPayload> {
  readonly aggregate = 'Project';
}
