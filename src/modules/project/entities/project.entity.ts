import { ProjectApplication } from '@module/project/entities/project-application.entity';
import {
  ProjectMember,
  ProjectMemberRole,
} from '@module/project/entities/project-member.entity';
import { ProjectRecruitmentPost } from '@module/project/entities/project-recruitment-post.entity';
import { ProjectMemberDeletionRestrictedError } from '@module/project/errors/project-member-deletion-restricted.error';
import { ProjectApplicationApprovedEvent } from '@module/project/events/project-application-approved.event';
import { ProjectApplicationCreatedEvent } from '@module/project/events/project-application-created.event';
import { ProjectApplicationMarkAsCheckedEvent } from '@module/project/events/project-application-mark-as-checked.event';
import { ProjectApplicationRejectedEvent } from '@module/project/events/project-application-rejected.event';
import { ProjectCreatedEvent } from '@module/project/events/project-created.event';
import { ProjectMemberCreatedEvent } from '@module/project/events/project-member-created.event';
import { ProjectMemberRemovedEvent } from '@module/project/events/project-member-removed.event';
import { ProjectRecruitmentCreatedEvent } from '@module/project/events/project-recruitment-post-created.event';

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
  positionName?: string;
  role: ProjectMemberRole;
  name: string;
  profileImagePath?: string;
  techStackNames?: string[];
}

interface CreateRecruitmentPostProps {
  projectId: string;
  authorId: string;
  title: string;
  description: string;
  position: string;
  techStackNames?: string[];
  maxRecruitsCount?: number;
  applicantsEndsAt?: Date;
}

interface CreateApplicationProps {
  applicantId: string;
  position: string;
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
      positionName: props.positionName,
      name: props.name,
      profileImagePath: props.profileImagePath,
      techStackNames: props.techStackNames,
    });

    this.apply(
      new ProjectMemberCreatedEvent(this.id, {
        accountId: member.accountId,
        projectId: member.projectId,
        positionName: member.positionName,
        role: member.role,
        name: member.name,
        profileImagePath: member.profileImagePath,
        techStackNames: member.techStackNames,
      }),
    );

    return member;
  }

  removeMember(member: ProjectMember) {
    if (member.role === ProjectMemberRole.owner) {
      throw new ProjectMemberDeletionRestrictedError(
        'Cannot leave project owner',
      );
    }

    this.apply(
      new ProjectMemberRemovedEvent(this.id, {
        accountId: member.accountId,
        projectId: this.id,
        memberId: member.id,
      }),
    );
  }

  createRecruitmentPost(props: CreateRecruitmentPostProps) {
    const recruitmentPost = ProjectRecruitmentPost.create({
      projectId: props.projectId,
      authorId: props.authorId,
      title: props.title,
      description: props.description,
      position: props.position,
      techStackNames: props.techStackNames,
    });

    this.apply(
      new ProjectRecruitmentCreatedEvent(this.id, {
        projectId: recruitmentPost.projectId,
        authorId: recruitmentPost.authorId,
        title: recruitmentPost.title,
        description: recruitmentPost.description,
        position: recruitmentPost.position,
        techStackNames: recruitmentPost.techStackNames,
        recruitmentStatus: recruitmentPost.recruitmentStatus,
        commentsCount: recruitmentPost.commentsCount,
        viewCount: recruitmentPost.viewCount,
      }),
    );

    return recruitmentPost;
  }

  createApplication(props: CreateApplicationProps) {
    const projectApplication = ProjectApplication.create({
      projectId: this.id,
      applicantId: props.applicantId,
      position: props.position,
    });

    this.apply(
      new ProjectApplicationCreatedEvent(this.id, {
        projectId: this.id,
        applicantId: projectApplication.applicantId,
        position: projectApplication.position,
        status: projectApplication.status,
      }),
    );

    return projectApplication;
  }

  markApplicationAsChecked(application: ProjectApplication) {
    application.markAsChecked();

    this.apply(
      new ProjectApplicationMarkAsCheckedEvent(this.id, {
        projectId: this.id,
        applicationId: application.id,
        applicantId: application.applicantId,
      }),
    );
  }

  approveApplication(application: ProjectApplication) {
    application.approve();

    this.apply(
      new ProjectApplicationApprovedEvent(this.id, {
        projectId: this.id,
        applicationId: application.id,
        applicantId: application.applicantId,
        position: application.position,
      }),
    );
  }

  rejectApplication(application: ProjectApplication) {
    application.reject();

    this.apply(
      new ProjectApplicationRejectedEvent(this.id, {
        projectId: this.id,
        applicationId: application.id,
        applicantId: application.applicantId,
      }),
    );
  }

  public validate(): void {}
}
