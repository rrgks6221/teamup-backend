import { EntityId } from '@common/base/base.entity';

export abstract class BaseMapper {
  static toPrimaryKey(entityId: EntityId): bigint {
    return BigInt(entityId);
  }

  static toEntityId(rawId: bigint): EntityId {
    return rawId.toString();
  }
}
