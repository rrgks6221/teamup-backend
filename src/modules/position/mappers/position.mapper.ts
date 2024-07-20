import { Position } from '@module/position/entities/position.entity';
import { PositionRaw } from '@module/position/repositories/position.repository.port';

import { BaseMapper } from '@common/base/base.mapper';

export class PositionMapper extends BaseMapper {
  static toEntity(raw: PositionRaw): Position {
    return new Position({
      id: this.toEntityId(raw.id),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      props: {
        name: raw.name,
      },
    });
  }

  static toPersistence(entity: Position): PositionRaw {
    return {
      id: this.toPrimaryKey(entity.id),
      name: entity.props.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
