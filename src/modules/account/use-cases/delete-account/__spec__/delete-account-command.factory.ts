import { Factory } from 'rosie';

import { DeleteAccountCommand } from '@module/account/use-cases/delete-account/delete-account.command';

import { generateEntityId } from '@common/base/base.entity';

export const DeleteAccountCommandFactory = Factory.define<DeleteAccountCommand>(
  DeleteAccountCommand.name,
  DeleteAccountCommand,
).attrs({
  id: () => generateEntityId(),
});
