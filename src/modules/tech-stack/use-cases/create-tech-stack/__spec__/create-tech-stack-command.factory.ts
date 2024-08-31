import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { CreateTechStackCommand } from '@module/tech-stack/use-cases/create-tech-stack/create-tech-stack.service.interface';

export const CreateTechStackCommandFactory =
  Factory.define<CreateTechStackCommand>(
    'CreateTechStackCommand',
    CreateTechStackCommand,
  ).attrs({
    name: () => faker.string.nanoid(10),
  });
