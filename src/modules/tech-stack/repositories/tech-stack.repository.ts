import { Inject, Injectable } from '@nestjs/common';

import { TechStack } from '@module/tech-stack/entities/tech-stack.entity';
import { TechStackMapper } from '@module/tech-stack/mappers/tech-stack.mapper';
import {
  TechStackFilter,
  TechStackRaw,
  TechStackRepositoryPort,
} from '@module/tech-stack/repositories/tech-stack.repository.port';

import {
  BaseRepository,
  ICursorPaginated,
  ICursorPaginatedParams,
} from '@common/base/base.repository';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class TechStackRepository
  extends BaseRepository<TechStack, TechStackRaw>
  implements TechStackRepositoryPort
{
  protected TABLE_NAME = 'techStack';

  constructor(
    @Inject(PRISMA_SERVICE) protected readonly prismaService: PrismaService,
  ) {
    super(prismaService, TechStackMapper);
  }

  async findOneByName(name: string): Promise<TechStack | undefined> {
    const raw = await this.prismaService.techStack.findUnique({
      where: {
        name,
      },
    });

    if (raw === null) {
      return;
    }

    return this.mapper.toEntity(raw);
  }

  async findByIds(ids: string[]): Promise<TechStack[]> {
    const raws = await this.prismaService.techStack.findMany({
      where: {
        id: {
          in: ids.map((id) => this.mapper.toPrimaryKey(id)),
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    return raws.map((raw) => this.mapper.toEntity(raw));
  }

  async findAll(): Promise<TechStack[]> {
    const raws = await this.prismaService.techStack.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    return raws.map((raw) => this.mapper.toEntity(raw));
  }

  findAllCursorPaginated(
    params: ICursorPaginatedParams<TechStack, TechStackFilter>,
  ): Promise<ICursorPaginated<TechStack>> {
    throw new Error('Method not implemented.');
  }
}
