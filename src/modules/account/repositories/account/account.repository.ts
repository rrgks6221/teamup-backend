import { Inject, Injectable } from '@nestjs/common';

import { Account } from '@module/account/entities/account.entity';
import { AccountMapper } from '@module/account/mappers/account.mapper';
import {
  AccountFilter,
  AccountRaw,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';

import {
  BaseRepository,
  ICursorPaginated,
  ICursorPaginatedParams,
} from '@common/base/base.repository';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class AccountRepository
  extends BaseRepository<Account, AccountRaw>
  implements AccountRepositoryPort
{
  protected TABLE_NAME = 'account';

  constructor(
    @Inject(PRISMA_SERVICE) protected readonly prismaService: PrismaService,
  ) {
    super(prismaService, AccountMapper);
  }

  async findOneByUsername(username: string): Promise<Account | undefined> {
    const raw = await this.prismaService.account.findUnique({
      where: {
        username,
      },
    });

    if (raw === null) {
      return;
    }

    return AccountMapper.toEntity(raw);
  }

  findAllCursorPaginated(
    params: ICursorPaginatedParams<Account, AccountFilter>,
  ): Promise<ICursorPaginated<Account>> {
    throw new Error('Method not implemented.');
  }
}
