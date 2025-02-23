import {
  BaseEntity,
  CreateEntityProps,
  generateEntityId,
} from '@common/base/base.entity';

export enum ProjectRecruitmentPostStatus {
  open = 'open',
  close = 'close',
}

export interface ProjectRecruitmentPostProps {
  projectId: string;
  authorId: string;
  title: string;
  description: string;
  position: string;
  techStackNames: string[];
  recruitmentStatus: ProjectRecruitmentPostStatus;
  commentsCount: number;
  viewCount: number;
}

interface CreateProjectRecruitmentPostProps {
  projectId: string;
  authorId: string;
  title: string;
  description: string;
  position: string;
  techStackNames?: string[];
}

export class ProjectRecruitmentPost extends BaseEntity<ProjectRecruitmentPostProps> {
  constructor(props: CreateEntityProps<ProjectRecruitmentPostProps>) {
    super(props);
  }

  static create(
    createProjectRecruitmentPostProps: CreateProjectRecruitmentPostProps,
  ) {
    const id = generateEntityId();
    const date = new Date();

    return new ProjectRecruitmentPost({
      id,
      props: {
        projectId: createProjectRecruitmentPostProps.projectId,
        authorId: createProjectRecruitmentPostProps.authorId,
        title: createProjectRecruitmentPostProps.title,
        description: createProjectRecruitmentPostProps.description,
        position: createProjectRecruitmentPostProps.position,
        techStackNames: createProjectRecruitmentPostProps.techStackNames ?? [],
        recruitmentStatus: ProjectRecruitmentPostStatus.open,
        commentsCount: 0,
        viewCount: 0,
      },
      createdAt: date,
      updatedAt: date,
    });
  }

  get projectId() {
    return this.props.projectId;
  }

  get authorId() {
    return this.props.authorId;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get position() {
    return this.props.position;
  }

  get techStackNames() {
    return this.props.techStackNames;
  }

  get recruitmentStatus() {
    return this.props.recruitmentStatus;
  }

  get commentsCount() {
    return this.props.commentsCount;
  }

  get viewCount() {
    return this.props.viewCount;
  }

  public validate(): void {}
}
