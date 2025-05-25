import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { ProjectInvitationStatus } from '@module/project/entities/project-invitation.entity';
import { ListProjectInvitationsQuery } from '@module/project/use-cases/list-project-invitations/list-project-invitations.query';

import { generateEntityId } from '@common/base/base.entity';

export const ListProjectInvitationsQueryFactory =
  Factory.define<ListProjectInvitationsQuery>(
    ListProjectInvitationsQuery.name,
    ListProjectInvitationsQuery,
  ).attrs({
    currentUserId: () => generateEntityId(),
    projectId: () => generateEntityId(),
    cursor: () => undefined,
    limit: () => 20,
    statuses: () =>
      faker.helpers.arrayElements(Object.values(ProjectInvitationStatus)),
  });
