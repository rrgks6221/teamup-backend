import { ProjectApplication } from '@module/project/entities/project-application.entity';
import { ProjectInvitation } from '@module/project/entities/project-invitation.entity';
import {
  ProjectMember,
  ProjectMemberRole,
} from '@module/project/entities/project-member.entity';
import { ProjectRecruitmentPost } from '@module/project/entities/project-recruitment-post.entity';
import { ProjectApplicationCreationRestrictedError } from '@module/project/errors/project-application-creation-restricted.error';
import { ProjectInvitationCreationRestrictedError } from '@module/project/errors/project-invitation-creation-restricted.error';
import { ProjectMemberAlreadyExistsError } from '@module/project/errors/project-member-already-exists.error';
import { ProjectMemberDeletionRestrictedError } from '@module/project/errors/project-member-deletion-restricted.error';
import { ProjectApplicationApprovedEvent } from '@module/project/events/project-application-approved.event';
import { ProjectApplicationCanceledEvent } from '@module/project/events/project-application-canceled.event';
import { ProjectApplicationCreatedEvent } from '@module/project/events/project-application-created.event';
import { ProjectApplicationMarkAsCheckedEvent } from '@module/project/events/project-application-mark-as-checked.event';
import { ProjectApplicationRejectedEvent } from '@module/project/events/project-application-rejected.event';
import { ProjectCreatedEvent } from '@module/project/events/project-created.event';
import { ProjectInvitationCreatedEvent } from '@module/project/events/project-invitation-created.event';
import { ProjectInvitationMarkAsCheckedEvent } from '@module/project/events/project-invitation-mark-as-checked.event';
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
  applications?: ProjectApplication[];
  invitations?: ProjectInvitation[];
  members?: ProjectMember[];
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
  positionName: string;
  techStackNames?: string[];
  maxRecruitsCount?: number;
  applicantsEndsAt?: Date;
}

interface CreateApplicationProps {
  applicantId: string;
  positionName: string;
}

interface CreateInvitationProps {
  inviterId: string;
  inviteeId: string;
  positionName: string;
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

  set applications(value: ProjectApplication[]) {
    this.props.applications = value;
  }

  set invitations(value: ProjectInvitation[]) {
    this.props.invitations = value;
  }

  set members(value: ProjectMember[]) {
    this.props.members = value;
  }

  createMember(props: CreateMemberProps): ProjectMember {
    if (this.props.members === undefined) {
      throw new Error('Project members not set');
    }

    const existingProjectMember = this.props.members.find(
      (member) => member.accountId === props.accountId,
    );

    if (existingProjectMember !== undefined) {
      throw new ProjectMemberAlreadyExistsError();
    }

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
      positionName: props.positionName,
      techStackNames: props.techStackNames,
    });

    this.apply(
      new ProjectRecruitmentCreatedEvent(this.id, {
        projectId: recruitmentPost.projectId,
        authorId: recruitmentPost.authorId,
        title: recruitmentPost.title,
        description: recruitmentPost.description,
        positionName: recruitmentPost.positionName,
        techStackNames: recruitmentPost.techStackNames,
        recruitmentStatus: recruitmentPost.recruitmentStatus,
        commentsCount: recruitmentPost.commentsCount,
        viewCount: recruitmentPost.viewCount,
      }),
    );

    return recruitmentPost;
  }

  createApplication(props: CreateApplicationProps) {
    if (this.props.applications === undefined) {
      throw new Error('Project applications not set');
    }

    const inprogressApplication = this.props.applications.find(
      (application) =>
        application.applicantId === props.applicantId &&
        application.getProgress() === 'inprogress',
    );

    if (inprogressApplication !== undefined) {
      throw new ProjectApplicationCreationRestrictedError(
        'Inprogress application exists in that project.',
      );
    }

    const projectApplication = ProjectApplication.create({
      projectId: this.id,
      applicantId: props.applicantId,
      positionName: props.positionName,
    });

    this.apply(
      new ProjectApplicationCreatedEvent(this.id, {
        projectId: this.id,
        applicantId: projectApplication.applicantId,
        positionName: projectApplication.positionName,
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

  cancelApplication(application: ProjectApplication) {
    application.cancel();

    this.apply(
      new ProjectApplicationCanceledEvent(this.id, {
        projectId: this.id,
        applicationId: application.id,
        applicantId: application.applicantId,
        positionName: application.positionName,
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
        positionName: application.positionName,
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

  createInvitation(props: CreateInvitationProps) {
    if (this.props.invitations === undefined) {
      throw new Error('Project invitations net set');
    }

    const inProgressInvitation = this.props.invitations.find(
      (invitation) =>
        invitation.inviteeId == props.inviteeId &&
        invitation.getProgress() === 'inprogress',
    );

    if (inProgressInvitation !== undefined) {
      throw new ProjectInvitationCreationRestrictedError(
        'Inprogress invitation exists in that project and invitee.',
      );
    }

    const projectInvitation = ProjectInvitation.create({
      projectId: this.id,
      inviteeId: props.inviteeId,
      inviterId: props.inviterId,
      positionName: props.positionName,
    });

    this.apply(
      new ProjectInvitationCreatedEvent(this.id, {
        projectId: this.id,
        inviteeId: projectInvitation.inviteeId,
        inviterId: projectInvitation.inviterId,
        positionName: projectInvitation.positionName,
        status: projectInvitation.status,
      }),
    );

    return projectInvitation;
  }

  markInvitationAsChecked(invitation: ProjectInvitation) {
    invitation.markAsChecked();

    this.apply(
      new ProjectInvitationMarkAsCheckedEvent(this.id, {
        projectId: this.id,
        invitationId: invitation.id,
        inviteeId: invitation.inviteeId,
        inviterId: invitation.inviterId,
      }),
    );
  }

  public validate(): void {}
}
