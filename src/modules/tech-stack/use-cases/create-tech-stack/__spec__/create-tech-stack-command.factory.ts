import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { CreateTechStackCommand } from '@module/tech-stack/use-cases/create-tech-stack/create-tech-stack.command';

export const CreateTechStackCommandFactory =
  Factory.define<CreateTechStackCommand>(
    CreateTechStackCommand.name,
    CreateTechStackCommand,
  ).attrs({
    name: () => faker.string.nanoid(10),
  });
