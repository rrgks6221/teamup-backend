import { Inject, Injectable } from '@nestjs/common';

import { Position } from '@module/position/entities/position.entity';
import { PositionMapper } from '@module/position/mappers/position.mapper';
import {
  PositionFilter,
  PositionRaw,
  PositionRepositoryPort,
} from '@module/position/repositories/position.repository.port';

import {
  BaseRepository,
  ICursorPaginated,
  ICursorPaginatedParams,
} from '@common/base/base.repository';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class PositionRepository
  extends BaseRepository<Position, PositionRaw>
  implements PositionRepositoryPort
{
  protected TABLE_NAME = 'position';

  constructor(
    @Inject(PRISMA_SERVICE) protected readonly prismaService: PrismaService,
  ) {
    super(prismaService, PositionMapper);
  }
  async findOneByName(name: string): Promise<Position | undefined> {
    const raw = await this.prismaService.position.findUnique({
      where: {
        name,
      },
    });

    if (raw === null) {
      return;
    }

    return this.mapper.toEntity(raw);
  }

  async findByIds(ids: Set<string>): Promise<Position[]> {
    const raws = await this.prismaService.position.findMany({
      where: {
        id: {
          in: Array.from(ids).map(this.mapper.toPrimaryKey),
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    return raws.map((raw) => this.mapper.toEntity(raw));
  }

  async findAll(): Promise<Position[]> {
    const raws = await this.prismaService.position.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    return raws.map((raw) => this.mapper.toEntity(raw));
  }

  findAllCursorPaginated(
    params: ICursorPaginatedParams<Position, PositionFilter>,
  ): Promise<ICursorPaginated<Position>> {
    throw new Error('Method not implemented.');
  }
}
