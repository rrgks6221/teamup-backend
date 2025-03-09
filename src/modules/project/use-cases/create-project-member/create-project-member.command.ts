import { ICommand } from '@nestjs/cqrs';

import { ProjectMemberRole } from '@module/project/entities/project-member.entity';

export interface ICreateProjectMemberCommandProps {
  accountId: string;
  projectId: string;
  positionName?: string;
  role: ProjectMemberRole;
}

export class CreateProjectMemberCommand implements ICommand {
  readonly accountId: string;
  readonly projectId: string;
  readonly positionName?: string;
  readonly role: ProjectMemberRole;

  constructor(props: ICreateProjectMemberCommandProps) {
    this.accountId = props.accountId;
    this.projectId = props.projectId;
    this.positionName = props.positionName;
    this.role = props.role;
  }
}
