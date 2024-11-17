import { Inject } from '@nestjs/common';

import {
  CopyObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'path';

import { ENV_KEY } from '@common/app-config/app-config.constant';
import { AppConfigService } from '@common/app-config/app-config.service';

import {
  AWS_S3_CLIENT,
  AwsS3Port,
  AwsS3UploadInfoDto,
  CopyObjectDto,
  GetUploadInfoDto,
} from '@shared/services/aws-s3/aws-s3.port';

export class AwsS3Adapter implements AwsS3Port {
  private readonly PRE_UPLOAD_METHOD = 'PUT';

  private readonly S3_URL: string;
  private readonly BUCKET_NAME: string;
  private readonly PRE_SIGNED_URL_EXPIRES_IN_SECOND: number;

  constructor(
    @Inject(AWS_S3_CLIENT) private readonly s3Client: S3Client,
    private readonly appConfigService: AppConfigService,
  ) {
    this.S3_URL = this.appConfigService.get<string>(ENV_KEY.AWS_S3_URL);
    this.BUCKET_NAME = this.appConfigService.get<string>(
      ENV_KEY.AWS_S3_BUCKET_NAME,
    );
    this.PRE_SIGNED_URL_EXPIRES_IN_SECOND = this.appConfigService.get<number>(
      ENV_KEY.AWS_S3_PRE_SIGNED_URL_EXPIRES_IN_SECOND,
    );
  }

  async getUploadUrlInfo(
    getUploadUrlDto: GetUploadInfoDto,
  ): Promise<AwsS3UploadInfoDto> {
    const command = new PutObjectCommand({
      Bucket: this.BUCKET_NAME,
      ACL: ObjectCannedACL.public_read,
      Key: getUploadUrlDto.key,
      ContentType: getUploadUrlDto.contentType,
      ContentLength: getUploadUrlDto.contentLength,
      ContentMD5: getUploadUrlDto.md5Hash,
    });

    const preSignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: this.PRE_SIGNED_URL_EXPIRES_IN_SECOND,
      signableHeaders: new Set(['content-type', 'Content-MD5']),
    });

    return {
      extension: getUploadUrlDto.extension,
      contentType: getUploadUrlDto.contentType,
      contentLength: getUploadUrlDto.contentLength,
      md5Hash: getUploadUrlDto.md5Hash,
      uploadUrlExpiresIn: this.PRE_SIGNED_URL_EXPIRES_IN_SECOND,
      uploadUrl: preSignedUrl,
      uploadMethod: this.PRE_UPLOAD_METHOD,
      uploadedUrl: path.join(this.S3_URL, getUploadUrlDto.key),
    };
  }

  async copyObject(copyObjectDto: CopyObjectDto) {
    const command = new CopyObjectCommand({
      ACL: ObjectCannedACL.public_read,
      Bucket: this.BUCKET_NAME,
      CopySource: this.BUCKET_NAME + '/' + copyObjectDto.copySource,
      Key: copyObjectDto.key,
    });

    await this.s3Client.send(command);
  }
}
