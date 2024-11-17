import { AccountSnsLinkProps } from '@module/account/entities/account-sns-link.vo';

import { DomainEvent } from '@common/base/base.domain-event';

interface AccountUpdatedEventPayload {
  name?: string;
  introduce?: string;
  profileImagePath?: string;
  positionNames?: string[];
  techStackNames?: string[];
  snsLinks?: AccountSnsLinkProps[];
}

export class AccountUpdatedEvent extends DomainEvent<AccountUpdatedEventPayload> {
  readonly aggregate = 'Account';
}
