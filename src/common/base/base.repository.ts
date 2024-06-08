import { BaseEntity, EntityId } from '@common/base/base.entity';
import { BaseMapper } from '@common/base/base.mapper';

import { PrismaService } from '@shared/prisma/prisma.service';

export enum SortOrder {
  Desc = 'DESC',
  Asc = 'ASC',
}

export interface ICursorPaginated<T> {
  cursor: string | null;
  data: T[];
}

export type OrderBy<T> = Partial<Record<keyof T, SortOrder>>[];

export interface ICursorPaginatedParams<T, Filter> {
  limit?: number;
  cursor: string | null;
  orderBy: OrderBy<T>;
  filter: Filter;
}

export interface RepositoryPort<E, ListFilter = Record<keyof E, unknown>> {
  insert(entity: E): Promise<E>;

  findOneById(id: EntityId): Promise<E | undefined>;

  findAllCursorPaginated(
    params: ICursorPaginatedParams<E, ListFilter>,
  ): Promise<ICursorPaginated<E>>;

  update(entity: E): Promise<E>;

  delete(entity: E): Promise<void>;
}

export interface IBaseMapper<
  Entity extends BaseEntity<unknown>,
  Raw extends { id: bigint },
> extends BaseMapper {
  toEntity(record: Raw): Entity;

  toPersistence(entity: Entity): Raw;

  toPrimaryKey(entityId: EntityId): bigint;

  toEntityId(rawId: bigint): EntityId;
}

export abstract class BaseRepository<
  Entity extends BaseEntity<unknown>,
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

    await this.prismaService.account.update({
      where: {
        id: raw.id,
      },
      data: raw,
    });

    return this.mapper.toEntity(raw);
  }

  async delete(entity: Entity): Promise<void> {
    await this.prismaService.account.delete({
      where: {
        id: this.mapper.toPrimaryKey(entity.id),
      },
    });
  }
}
