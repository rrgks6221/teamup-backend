import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { Image, ImageExtension } from '@module/image/entities/image.entity';
import { CreateImageUploadUrlCommand } from '@module/image/use-cases/create-image-upload-url/create-image-upload-url.command';

export const CreateImageUploadUrlCommandFactory =
  Factory.define<CreateImageUploadUrlCommand>(
    CreateImageUploadUrlCommand.name,
    CreateImageUploadUrlCommand,
  ).attrs({
    extension: faker.helpers.enumValue(ImageExtension),
    contentLength: faker.number.int({ max: Image.MAX_SIZE_IN_BYTE }),
    md5Hash: faker.string.nanoid(),
  });
