import { EntityId, TBaseEntity } from '@common/base/base.entity';
import { IBaseMapper } from '@common/base/base.mapper';

import { PrismaService } from '@shared/prisma/prisma.service';

export interface ICursorPaginated<T> {
  cursor?: string;
  data: T[];
}

export interface ICursorPaginatedParams<
  Order = Record<string, unknown>,
  Filter = Record<string, unknown>,
> {
  limit?: number;
  cursor?: string;
  orderBy: Order;
  filter: Filter;
}

export interface RepositoryPort<
  E,
  ListFilter = Record<string, unknown>,
  ListOrder = Record<string, unknown>,
> {
  insert(entity: E): Promise<E>;

  findOneById(id: EntityId): Promise<E | undefined>;

  findAllCursorPaginated(
    params: ICursorPaginatedParams<ListOrder, ListFilter>,
  ): Promise<ICursorPaginated<E>>;

  update(entity: E): Promise<E>;

  delete(entity: E): Promise<void>;
}

export abstract class BaseRepository<
  Entity extends TBaseEntity<unknown>,
  Raw extends { id: bigint },
> implements Omit<RepositoryPort<Entity>, 'findAllCursorPaginated'>
{
  protected abstract TABLE_NAME: string;

  constructor(
    protected readonly prismaService: PrismaService,
    protected readonly mapper: IBaseMapper<Entity, Raw>,
  ) {}

  async insert(entity: Entity): Promise<Entity> {
    const raw = this.mapper.toPersistence(entity);

    await this.prismaService[this.TABLE_NAME].create({
      data: raw,
    });

    return entity;
  }

  async findOneById(id: EntityId): Promise<Entity | undefined> {
    if (isNaN(Number(id))) {
      return;
    }

    const raw = await this.prismaService[this.TABLE_NAME].findUnique({
      where: {
        id: this.mapper.toPrimaryKey(id),
      },
    });

    if (raw === null) {
      return;
    }

    return this.mapper.toEntity(raw);
  }

  async update(entity: Entity): Promise<Entity> {
    const raw = this.mapper.toPersistence(entity);

    await this.prismaService[this.TABLE_NAME].update({
      where: {
        id: raw.id,
      },
      data: raw,
    });

    return this.mapper.toEntity(raw);
  }

  async delete(entity: Entity): Promise<void> {
    await this.prismaService[this.TABLE_NAME].delete({
      where: {
        id: this.mapper.toPrimaryKey(entity.id),
      },
    });
  }
}
