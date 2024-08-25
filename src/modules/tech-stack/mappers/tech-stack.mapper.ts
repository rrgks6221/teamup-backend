import { TechStack } from '@module/tech-stack/entities/tech-stack.entity';
import { TechStackRaw } from '@module/tech-stack/repositories/tech-stack.repository.port';

import { BaseMapper } from '@common/base/base.mapper';

export class TechStackMapper extends BaseMapper {
  static toEntity(raw: TechStackRaw): TechStack {
    return new TechStack({
      id: this.toEntityId(raw.id),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      props: {
        name: raw.name,
      },
    });
  }

  static toPersistence(entity: TechStack): TechStackRaw {
    return {
      id: this.toPrimaryKey(entity.id),
      name: entity.props.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
