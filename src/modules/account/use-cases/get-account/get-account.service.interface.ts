import { Account } from '@module/account/entities/account.entity';

import { IBaseService } from '@common/base/base-service';
import { EntityId } from '@common/base/base.entity';

export const GET_ACCOUNT_SERVICE = Symbol('IGetAccountService');

export interface IGetAccountQueryProps {
  id: EntityId;
}

export class GetAccountQuery {
  readonly id: EntityId;

  constructor(props: IGetAccountQueryProps) {
    this.id = props.id;
  }
}

export interface IGetAccountService
  extends IBaseService<GetAccountQuery, Account> {}
