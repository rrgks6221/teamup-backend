import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { Account } from '@module/account/entities/account.entity';
import { UpdateAccountCommand } from '@module/account/use-cases/update-account/update-account.service.interface';

import { generateEntityId } from '@common/base/base.entity';

export const UpdateAccountCommandFactory = Factory.define<UpdateAccountCommand>(
  'UpdateAccountCommand',
  UpdateAccountCommand,
).attrs({
  accountId: () => generateEntityId(),
  nickname: () => faker.string.nanoid(Account.NICKNAME_MAX_LENGTH),
});
