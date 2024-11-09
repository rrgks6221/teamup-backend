import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { CreatePositionCommand } from '@module/position/use-cases/create-position/create-position.command';

export const CreatePositionCommandFactory =
  Factory.define<CreatePositionCommand>(
    CreatePositionCommand.name,
    CreatePositionCommand,
  ).attrs({
    name: () => faker.string.nanoid(10),
  });
