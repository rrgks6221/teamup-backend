import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { ProjectMemberRole } from '@module/project/entities/project-member.entity';
import { CreateProjectMemberCommand } from '@module/project/use-cases/create-project-member/create-project-member.command';

import { generateEntityId } from '@common/base/base.entity';

export const CreateProjectMemberCommandFactory =
  Factory.define<CreateProjectMemberCommand>(
    CreateProjectMemberCommand.name,
    CreateProjectMemberCommand,
  ).attrs({
    accountId: () => generateEntityId(),
    projectId: () => generateEntityId(),
    position: () => faker.string.alpha(),
    role: () => faker.helpers.enumValue(ProjectMemberRole),
  });
