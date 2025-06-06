import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { Account } from '@module/account/entities/account.entity';
import { UpdateAccountCommand } from '@module/account/use-cases/update-account/update-account.command';

import { generateEntityId } from '@common/base/base.entity';

export const UpdateAccountCommandFactory = Factory.define<UpdateAccountCommand>(
  UpdateAccountCommand.name,
  UpdateAccountCommand,
).attrs({
  accountId: () => generateEntityId(),
  name: () => faker.string.nanoid(Account.NAME_MAX_LENGTH),
  introduce: () => faker.string.alpha(),
  profileImagePath: () => faker.string.nanoid(),
  positionNames: () => [],
  techStackNames: () => [],
  snsLinks: () => [],
});
