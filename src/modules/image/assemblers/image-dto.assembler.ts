import { InternalServerErrorException } from '@nestjs/common';

import { ImageResponseDto } from '@module/image/dto/image.response-dto';
import { PreUploadImageResponseDto } from '@module/image/dto/pre-upload-image.response-dto';
import { Image } from '@module/image/entities/image.entity';

import { InternalServerError } from '@common/base/base.error';

export class ImageDtoAssembler {
  static convertToDto(image: Image): ImageResponseDto {
    const dto = new ImageResponseDto({
      id: image.id,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
    });

    return dto;
  }

  static convertToPreUploadDto(image: Image): PreUploadImageResponseDto {
    const dto = new PreUploadImageResponseDto({
      id: image.id,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
    });

    dto.extension = image.extension;
    dto.contentType = image.contentType;
    dto.contentLength = image.contentLength;
    dto.md5Hash = image.md5Hash;

    if (image.preUploadInfo === undefined) {
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Image pre-upload information not set',
        code: InternalServerError.CODE,
      });
    }

    dto.uploadUrlExpiresIn = image.preUploadInfo.uploadUrlExpiresIn;
    dto.uploadUrl = image.preUploadInfo.uploadUrl;
    dto.uploadMethod = image.preUploadInfo.uploadMethod;
    dto.uploadedUrl = image.preUploadInfo.uploadedUrl;

    return dto;
  }
}
