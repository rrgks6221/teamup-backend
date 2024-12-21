import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { CreateProjectCommand } from '@module/project/use-cases/create-project/create-project.command';

import { generateEntityId } from '@common/base/base.entity';

export const CreateProjectCommandFactory = Factory.define<CreateProjectCommand>(
  CreateProjectCommand.name,
  CreateProjectCommand,
).attrs({
  ownerId: () => generateEntityId(),
  name: () => faker.string.alpha(),
  description: () => faker.string.alpha(),
  category: () => faker.string.alpha(),
  tags: () => [],
});
