import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import {
  ProjectInvitation,
  ProjectInvitationProps,
  ProjectInvitationStatus,
} from '@module/project/entities/project-invitation.entity';

import { generateEntityId } from '@common/base/base.entity';

export const ProjectInvitationFactory = Factory.define<
  ProjectInvitation & ProjectInvitationProps
>(ProjectInvitation.name)
  .attrs({
    id: () => generateEntityId(),
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
    projectId: () => generateEntityId(),
    inviterId: () => generateEntityId(),
    inviteeId: () => generateEntityId(),
    positionName: () => faker.string.alpha(),
    status: () => ProjectInvitationStatus.pending,
    checkedAt: () => undefined,
    canceledAt: () => undefined,
    approvedAt: () => undefined,
    rejectedAt: () => undefined,
  })
  .after(
    ({ id, createdAt, updatedAt, ...props }) =>
      new ProjectInvitation({ id, createdAt, updatedAt, props }),
  );
