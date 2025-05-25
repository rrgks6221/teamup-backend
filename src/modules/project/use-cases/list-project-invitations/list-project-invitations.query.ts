import { IQuery } from '@nestjs/cqrs';

import { ProjectInvitationStatus } from '@module/project/entities/project-invitation.entity';

export interface IListProjectInvitationsQueryProps {
  currentUserId: string;
  projectId: string;
  cursor?: string;
  limit?: number;
  statuses?: ProjectInvitationStatus[];
}

export class ListProjectInvitationsQuery implements IQuery {
  readonly currentUserId: string;
  readonly projectId: string;
  readonly cursor?: string;
  readonly limit: number;
  readonly statuses?: ProjectInvitationStatus[];

  constructor(props: IListProjectInvitationsQueryProps) {
    this.currentUserId = props.currentUserId;
    this.projectId = props.projectId;
    this.cursor = props.cursor;
    this.limit = props.limit ?? 20;
    this.statuses = props.statuses;
  }
}
