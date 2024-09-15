import { Account } from '@module/account/entities/account.entity';

import { IBaseService } from '@common/base/base-service';
import { EntityId } from '@common/base/base.entity';

export const UPDATE_ACCOUNT_SERVICE = Symbol('IUpdateAccountService');

export interface IUpdateAccountCommandProps {
  accountId: EntityId;
  name?: string;
  positionIds?: string[];
}

export class UpdateAccountCommand {
  readonly accountId: EntityId;
  readonly name?: string;
  readonly positionIds?: string[];

  constructor(props: IUpdateAccountCommandProps) {
    this.accountId = props.accountId;
    this.name = props.name;
    this.positionIds = props.positionIds;
  }
}

export interface IUpdateAccountService
  extends IBaseService<UpdateAccountCommand, Account> {}
