import { Factory } from 'rosie';

import { DeleteAccountCommand } from '@module/account/use-cases/delete-account/delete-account.service.interface';

import { generateEntityId } from '@common/base/base.entity';

export const DeleteAccountCommandFactory = Factory.define<DeleteAccountCommand>(
  'DeleteAccountCommand',
  DeleteAccountCommand,
).attrs({
  id: () => generateEntityId(),
});
