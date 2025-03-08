import { ICommand } from '@nestjs/cqrs';

import { ProjectMemberRole } from '@module/project/entities/project-member.entity';

export interface ICreateProjectMemberCommandProps {
  accountId: string;
  projectId: string;
  position?: string;
  role: ProjectMemberRole;
}

export class CreateProjectMemberCommand implements ICommand {
  readonly accountId: string;
  readonly projectId: string;
  readonly position?: string;
  readonly role: ProjectMemberRole;

  constructor(props: ICreateProjectMemberCommandProps) {
    this.accountId = props.accountId;
    this.projectId = props.projectId;
    this.position = props.position;
    this.role = props.role;
  }
}
