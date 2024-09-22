import { Account } from '@module/account/entities/account.entity';

import { IBaseService } from '@common/base/base-service';
import { EntityId } from '@common/base/base.entity';

export const UPDATE_ACCOUNT_SERVICE = Symbol('IUpdateAccountService');

export interface IUpdateAccountCommandProps {
  accountId: EntityId;
  name?: string;
  positionIds?: string[];
  techStackIds?: string[];
}

export class UpdateAccountCommand {
  readonly accountId: EntityId;
  readonly name?: string;
  readonly positionIds?: string[];
  readonly techStackIds?: string[];

  constructor(props: IUpdateAccountCommandProps) {
    this.accountId = props.accountId;
    this.name = props.name;
    this.positionIds = props.positionIds;
    this.techStackIds = props.techStackIds;
  }
}

export interface IUpdateAccountService
  extends IBaseService<UpdateAccountCommand, Account> {}
