import { ProjectRecruitmentPostStatus } from '@module/project/entities/project-recruitment-post.entity';

import { DomainEvent } from '@common/base/base.domain-event';

interface ProjectRecruitmentCreatedEventPayload {
  projectId: string;
  authorId: string;
  title: string;
  description: string;
  position: string;
  techStackNames: string[];
  recruitmentStatus: ProjectRecruitmentPostStatus;
  maxRecruitsCount?: number;
  currentRecruitsCount: number;
  applicantsEndsAt?: Date;
  applicantsCount: number;
}

export class ProjectRecruitmentCreatedEvent extends DomainEvent<ProjectRecruitmentCreatedEventPayload> {
  readonly aggregate = 'Project';
}
