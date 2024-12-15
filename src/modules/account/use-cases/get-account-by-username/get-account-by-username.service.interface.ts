import { Account } from '@module/account/entities/account.entity';

import { IBaseService } from '@common/base/base-service';

export const GET_ACCOUNT_BY_USERNAME_SERVICE = Symbol(
  'IGetAccountByUsernameService',
);

export interface IGetAccountByUsernameQueryProps {
  username: string;
}

export class GetAccountByUsernameQuery {
  readonly username: string;

  constructor(props: IGetAccountByUsernameQueryProps) {
    this.username = props.username;
  }
}

export interface IGetAccountByUsernameService
  extends IBaseService<GetAccountByUsernameQuery, Account> {}
