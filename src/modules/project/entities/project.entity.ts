import {
  ProjectMember,
  ProjectMemberRole,
} from '@module/project/entities/project-member.entity';
import { ProjectCreatedEvent } from '@module/project/events/project-created.event';
import { ProjectMemberCreatedEvent } from '@module/project/events/project-member-created.event';

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
  currentMemberCount: number;
  tags: string[];
}

interface CreateProjectProps {
  ownerId: string;
  name: string;
  description: string;
  category: string;
  tags?: string[];
}

interface CreateMemberProps {
  accountId: string;
  position?: string;
  role: ProjectMemberRole;
  name: string;
  profileImagePath?: string;
  techStackNames?: string[];
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
        currentMemberCount: 0,
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
        currentMemberCount: 0,
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

  get currentMemberCount(): number {
    return this.props.currentMemberCount;
  }

  get tags(): string[] {
    return this.props.tags;
  }

  createMember(props: CreateMemberProps): ProjectMember {
    const member = ProjectMember.create({
      accountId: props.accountId,
      projectId: this.id,
      role: props.role,
      name: props.name,
      profileImagePath: props.profileImagePath,
      techStackNames: props.techStackNames,
    });

    this.apply(
      new ProjectMemberCreatedEvent(this.id, {
        accountId: member.accountId,
        projectId: member.projectId,
        position: member.position,
        role: member.role,
        name: member.name,
        profileImagePath: member.profileImagePath,
        techStackNames: member.techStackNames,
      }),
    );

    return member;
  }

  public validate(): void {}
}
