import { Inject, Injectable } from '@nestjs/common';

import path from 'path';

import { Image } from '@module/image/entities/image.entity';
import {
  CreateImageUploadUrlCommand,
  ICreateImageUploadUrlService,
} from '@module/image/use-cases/create-image-upload-url/create-image-upload-url.service.interface';

import { AWS_S3_PORT, AwsS3Port } from '@shared/services/aws-s3/aws-s3.port';

@Injectable()
export class CreateImageUploadUrlService
  implements ICreateImageUploadUrlService
{
  constructor(@Inject(AWS_S3_PORT) private readonly awsS3Adapter: AwsS3Port) {}

  async execute(command: CreateImageUploadUrlCommand): Promise<Image> {
    const image = Image.create({
      extension: command.extension,
      contentLength: command.contentLength,
      md5Hash: command.md5Hash,
    });

    const uploadedUrlInfo = await this.awsS3Adapter.getUploadUrlInfo({
      key: path.join(Image.PRE_UPLOAD_PREFIX, image.name),
      extension: image.extension,
      contentType: image.contentType,
      contentLength: image.contentLength,
      md5Hash: image.md5Hash,
    });

    image.preUploadInfo = {
      uploadUrlExpiresIn: uploadedUrlInfo.uploadUrlExpiresIn,
      uploadUrl: uploadedUrlInfo.uploadUrl,
      uploadMethod: uploadedUrlInfo.uploadMethod,
      uploadedUrl: uploadedUrlInfo.uploadedUrl,
    };

    return image;
  }
}
