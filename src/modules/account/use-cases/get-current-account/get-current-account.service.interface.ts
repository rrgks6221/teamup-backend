import { Account } from '@module/account/entities/account.entity';

import { IBaseService } from '@common/base/base-service';

export const GET_CURRENT_ACCOUNT_SERVICE = Symbol('IGetCurrentAccountService');

export interface IGetCurrentAccountQueryProps {
  accountId: string;
}

export class GetCurrentAccountQuery {
  readonly accountId: string;

  constructor(props: IGetCurrentAccountQueryProps) {
    this.accountId = props.accountId;
  }
}

export interface IGetCurrentAccountService
  extends IBaseService<GetCurrentAccountQuery, Account> {}
