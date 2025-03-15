import { ProjectRecruitmentPostStatus } from '@module/project/entities/project-recruitment-post.entity';

import { DomainEvent } from '@common/base/base.domain-event';

interface ProjectRecruitmentCreatedEventPayload {
  projectId: string;
  authorId: string;
  title: string;
  description: string;
  positionName: string;
  techStackNames: string[];
  recruitmentStatus: ProjectRecruitmentPostStatus;
  commentsCount: number;
  viewCount: number;
}

export class ProjectRecruitmentCreatedEvent extends DomainEvent<ProjectRecruitmentCreatedEventPayload> {
  readonly aggregate = 'Project';
}
