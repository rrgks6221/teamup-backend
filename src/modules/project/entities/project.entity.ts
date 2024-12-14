import { ProjectCreatedEvent } from '@module/project/events/project-created.event';

import {
  AggregateRoot,
  CreateEntityProps,
  generateEntityId,
} from '@common/base/base.entity';

export enum ProjectStatus {
  recruiting = 'recruiting',
  inProgress = 'inProgress',
  completed = 'completed',
}

export interface ProjectProps {
  ownerId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  /**
   * enum 또는 별도의 테이블로 관리
   */
  category: string;
  maxMemberCount: number;
  currentMemberCount: number;
  tags: string[];
}

interface CreateProjectProps {
  ownerId: string;
  name: string;
  description: string;
  category: string;
  maxMemberCount?: number;
  tags?: string[];
}

export class Project extends AggregateRoot<ProjectProps> {
  constructor(props: CreateEntityProps<ProjectProps>) {
    super(props);
  }

  static create(createProjectProps: CreateProjectProps): Project {
    const id = generateEntityId();
    const date = new Date();

    const project = new Project({
      id,
      props: {
        ownerId: createProjectProps.ownerId,
        name: createProjectProps.name,
        description: createProjectProps.description,
        status: ProjectStatus.recruiting,
        category: createProjectProps.category,
        maxMemberCount: createProjectProps.maxMemberCount ?? 0,
        currentMemberCount: 1,
        tags: createProjectProps.tags ?? [],
      },
      createdAt: date,
      updatedAt: date,
    });

    project.apply(
      new ProjectCreatedEvent(project.id, {
        ownerId: createProjectProps.ownerId,
        name: createProjectProps.name,
        description: createProjectProps.description,
        status: ProjectStatus.recruiting,
        category: createProjectProps.category,
        maxMemberCount: createProjectProps.maxMemberCount ?? 0,
        currentMemberCount: 1,
        tags: createProjectProps.tags ?? [],
      }),
    );

    return project;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get status(): ProjectStatus {
    return this.props.status;
  }

  get category(): string {
    return this.props.category;
  }

  get maxMemberCount(): number {
    return this.props.maxMemberCount;
  }

  get currentMemberCount(): number {
    return this.props.currentMemberCount;
  }

  get tags(): string[] {
    return this.props.tags;
  }

  public validate(): void {}
}
