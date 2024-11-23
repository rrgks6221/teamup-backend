import { AccountSnsLink } from '@module/account/entities/account-sns-link.vo';
import {
  AccountRole,
  SignInType,
} from '@module/account/entities/account.entity';

import { DomainEvent } from '@common/base/base.domain-event';

interface AccountCreatedEventPayload {
  username?: string;
  password?: string;
  signInType: SignInType;
  role: AccountRole;
  name?: string;
  positionNames?: string[];
  techStackNames?: string[];
  snsLinks?: AccountSnsLink[];
}

export class AccountCreatedEvent extends DomainEvent<AccountCreatedEventPayload> {
  readonly aggregate = 'Account';
}
