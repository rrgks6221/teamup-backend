import {
  AggregateRoot,
  CreateEntityProps,
  generateEntityId,
} from '@common/base/base.entity';

export enum ProjectMemberRole {
  owner = 'owner',
  admin = 'admin',
  member = 'member',
}

export interface ProjectMemberProps {
  accountId: string;
  projectId: string;
  positionName?: string;
  role: ProjectMemberRole;
  name: string;
  profileImagePath?: string;
  techStackNames: string[];
}

interface CreateProjectMemberProps {
  accountId: string;
  projectId: string;
  positionName?: string;
  role: ProjectMemberRole;
  name: string;
  profileImagePath?: string;
  techStackNames?: string[];
}

export class ProjectMember extends AggregateRoot<ProjectMemberProps> {
  constructor(props: CreateEntityProps<ProjectMemberProps>) {
    super(props);
  }

  static create(createProjectMemberProps: CreateProjectMemberProps) {
    const id = generateEntityId();
    const date = new Date();

    return new ProjectMember({
      id,
      props: {
        accountId: createProjectMemberProps.accountId,
        projectId: createProjectMemberProps.projectId,
        positionName: createProjectMemberProps.positionName,
        role: createProjectMemberProps.role,
        name: createProjectMemberProps.name,
        profileImagePath: createProjectMemberProps.profileImagePath,
        techStackNames: createProjectMemberProps.techStackNames ?? [],
      },
      createdAt: date,
      updatedAt: date,
    });
  }

  get accountId() {
    return this.props.accountId;
  }

  get projectId() {
    return this.props.projectId;
  }

  get positionName() {
    return this.props.positionName;
  }

  get role() {
    return this.props.role;
  }

  get name() {
    return this.props.name;
  }

  get profileImagePath() {
    return this.props.profileImagePath;
  }

  get techStackNames() {
    return this.props.techStackNames;
  }

  isManager() {
    return (
      this.role === ProjectMemberRole.owner ||
      this.role === ProjectMemberRole.admin
    );
  }

  public validate(): void {}
}
