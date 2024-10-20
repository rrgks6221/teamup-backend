import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import {
  Image,
  ImageExtension,
  ImageProps,
} from '@module/image/entities/image.entity';

import { generateEntityId } from '@common/base/base.entity';

export const ImageFactory = Factory.define<Image & ImageProps>('Image')
  .attrs({
    id: () => generateEntityId(),
    extension: () => faker.helpers.enumValue(ImageExtension),
    contentLength: () => faker.number.int({ max: Image.MAX_SIZE_IN_BYTE }),
    md5Hash: () => faker.string.nanoid(),
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
  })
  .after(
    ({ id, createdAt, updatedAt, ...props }) =>
      new Image({ id, createdAt, updatedAt, props }),
  );
