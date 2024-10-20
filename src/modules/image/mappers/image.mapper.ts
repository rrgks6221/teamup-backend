import { BaseMapper } from '@common/base/base.mapper';

/**
 * 현재 repository를 따로 두지 않기에 구현하지 않음
 */
export class ImageMapper extends BaseMapper {
  // static toEntity(raw: ImageRaw): Image {
  //   return new Image({
  //     id: this.toEntityId(raw.id),
  //     createdAt: raw.createdAt,
  //     updatedAt: raw.updatedAt,
  //     props: {},
  //   });
  // }
  // static toPersistence(entity: Image): ImageRaw {
  //   return {
  //     id: this.toPrimaryKey(entity.id),
  //     createdAt: entity.createdAt,
  //     updatedAt: entity.updatedAt,
  //   };
  // }
}
