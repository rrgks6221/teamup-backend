import { ICommand } from '@nestjs/cqrs';

import { AccountSnsLinkVisibilityScope } from '@module/account/entities/account-sns-link.vo';

import { EntityId } from '@common/base/base.entity';

export interface IUpdateAccountCommandProps {
  accountId: EntityId;
  name?: string;
  introduce?: string;
  profileImagePath?: string;
  positionIds?: string[];
  techStackIds?: string[];
  snsLinks?: { url: string; platform: string }[];
}

export class UpdateAccountCommand implements ICommand {
  readonly accountId: EntityId;
  readonly name?: string;
  readonly introduce?: string;
  readonly profileImagePath?: string;
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
    this.profileImagePath = props.profileImagePath;
    this.positionIds = props.positionIds;
    this.techStackIds = props.techStackIds;
    this.snsLinks = props.snsLinks?.map((snsLink) => ({
      url: snsLink.url,
      platform: snsLink.platform,
      visibilityScope: AccountSnsLinkVisibilityScope.public,
    }));
  }
}
