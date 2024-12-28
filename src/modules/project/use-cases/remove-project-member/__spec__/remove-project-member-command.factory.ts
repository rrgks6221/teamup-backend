import { Factory } from 'rosie';

import { RemoveProjectMemberCommand } from '@module/project/use-cases/remove-project-member/remove-project-member.command';

import { generateEntityId } from '@common/base/base.entity';

export const RemoveProjectMemberCommandFactory =
  Factory.define<RemoveProjectMemberCommand>(
    RemoveProjectMemberCommand.name,
    RemoveProjectMemberCommand,
  ).attrs({
    currentUserId: () => generateEntityId(),
    projectId: () => generateEntityId(),
    memberId: () => generateEntityId(),
  });
