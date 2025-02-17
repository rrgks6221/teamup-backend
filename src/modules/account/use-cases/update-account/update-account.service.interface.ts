import { Account } from '@module/account/entities/account.entity';

import { IBaseService } from '@common/base/base-service';
import { EntityId } from '@common/base/base.entity';

export const UPDATE_ACCOUNT_SERVICE = Symbol('IUpdateAccountService');

export interface IUpdateAccountCommandProps {
  accountId: EntityId;
  nickname?: string;
}

export class UpdateAccountCommand {
  readonly accountId: EntityId;
  readonly nickname?: string;

  constructor(props: IUpdateAccountCommandProps) {
    this.accountId = props.accountId;
    this.nickname = props.nickname;
  }
}

export interface IUpdateAccountService
  extends IBaseService<UpdateAccountCommand, Account> {}
