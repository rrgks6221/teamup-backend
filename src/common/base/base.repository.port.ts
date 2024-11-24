import { EntityId } from '@src/common/base/base.entity';

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
