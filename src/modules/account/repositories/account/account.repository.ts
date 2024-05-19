import { Inject, Injectable } from '@nestjs/common';

import { Account } from '@module/account/entities/account.entity';
import { AccountMapper } from '@module/account/mappers/account.mapper';
import {
  AccountFilter,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';

import { EntityId } from '@common/base/base.entity';
import {
  ICursorPaginated,
  ICursorPaginatedParams,
} from '@common/base/base.repository.port';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class AccountRepository implements AccountRepositoryPort {
  constructor(
    @Inject(PRISMA_SERVICE) private readonly prismaService: PrismaService,
  ) {}

  async insert(entity: Account): Promise<Account> {
    const raw = AccountMapper.toPersistence(entity);

    await this.prismaService.account.create({
      data: raw,
    });

    return entity;
  }

  async findOneById(id: EntityId): Promise<Account | undefined> {
    if (isNaN(Number(id))) {
      return;
    }

    const raw = await this.prismaService.account.findUnique({
      where: {
        id: BigInt(id),
      },
    });

    if (raw === null) {
      return;
    }

    return AccountMapper.toEntity(raw);
  }

  async findOneByNickname(nickname: string): Promise<Account | undefined> {
    const raw = await this.prismaService.account.findUnique({
      where: {
        nickname,
      },
    });

    if (raw === null) {
      return;
    }

    return AccountMapper.toEntity(raw);
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

  async update(entity: Account): Promise<Account> {
    const raw = AccountMapper.toPersistence(entity);

    await this.prismaService.account.update({
      where: {
        id: raw.id,
      },
      data: raw,
    });

    return AccountMapper.toEntity(raw);
  }

  async delete(entity: Account): Promise<void> {
    await this.prismaService.account.delete({
      where: {
        id: BigInt(entity.id),
      },
    });
  }
}
