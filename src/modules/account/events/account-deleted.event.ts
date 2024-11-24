import { AccountProps } from '@module/account/entities/account.entity';

import { DomainEvent } from '@common/base/base.domain-event';

interface AccountDeletedEventPayload extends AccountProps {}

export class AccountDeletedEvent extends DomainEvent<AccountDeletedEventPayload> {
  readonly aggregate = 'Account';
}
