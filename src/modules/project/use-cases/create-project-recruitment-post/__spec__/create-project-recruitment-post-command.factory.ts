import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { CreateProjectRecruitmentPostCommand } from '@module/project/use-cases/create-project-recruitment-post/create-project-recruitment-post.command';

import { generateEntityId } from '@common/base/base.entity';

export const CreateProjectRecruitmentPostCommandFactory =
  Factory.define<CreateProjectRecruitmentPostCommand>(
    CreateProjectRecruitmentPostCommand.name,
    CreateProjectRecruitmentPostCommand,
  ).attrs({
    projectId: () => generateEntityId(),
    currentUserId: () => generateEntityId(),
    title: () => faker.string.alpha(),
    description: () => faker.string.alpha(),
    positionName: () => generateEntityId(),
    techStackIds: () => [],
  });
