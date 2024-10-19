import { AccountSnsLinkVisibilityScope } from '@module/account/entities/account-sns-link.vo';
import { Account } from '@module/account/entities/account.entity';

import { IBaseService } from '@common/base/base-service';
import { EntityId } from '@common/base/base.entity';

export const UPDATE_ACCOUNT_SERVICE = Symbol('IUpdateAccountService');

export interface IUpdateAccountCommandProps {
  accountId: EntityId;
  name?: string;
  introduce?: string;
  positionIds?: string[];
  techStackIds?: string[];
  snsLinks?: { url: string; platform: string }[];
}

export class UpdateAccountCommand {
  readonly accountId: EntityId;
  readonly name?: string;
  readonly introduce?: string;
  readonly positionIds?: string[];
  readonly techStackIds?: string[];
  readonly snsLinks?: {
    url: string;
    platform: string;
    visibilityScope: AccountSnsLinkVisibilityScope;
  }[];

  constructor(props: IUpdateAccountCommandProps) {
    this.accountId = props.accountId;
    this.name = props.name;
    this.introduce = props.introduce;
    this.positionIds = props.positionIds;
    this.techStackIds = props.techStackIds;
    this.snsLinks = props.snsLinks?.map((snsLink) => ({
      url: snsLink.url,
      platform: snsLink.platform,
      visibilityScope: AccountSnsLinkVisibilityScope.public,
    }));
  }
}

export interface IUpdateAccountService
  extends IBaseService<UpdateAccountCommand, Account> {}
