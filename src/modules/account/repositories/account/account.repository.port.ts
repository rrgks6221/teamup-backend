import { Account as AccountModel } from '@prisma/client';

import { Account } from '@module/account/entities/account.entity';

import { RepositoryPort } from '@common/base/base.repository';

export const ACCOUNT_REPOSITORY = Symbol('ACCOUNT_REPOSITORY');

export interface AccountRaw extends AccountModel {}

export interface AccountFilter {}

export interface AccountRepositoryPort
  extends RepositoryPort<Account, AccountFilter> {
  findOneByUsername(username: string): Promise<Account | undefined>;
}
