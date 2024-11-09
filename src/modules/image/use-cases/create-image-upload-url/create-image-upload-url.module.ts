import { Module } from '@nestjs/common';

import { CreateImageUploadUrlController } from '@module/image/use-cases/create-image-upload-url/create-image-upload-url.controller';
import { CreateImageUploadUrlHandler } from '@module/image/use-cases/create-image-upload-url/create-image-upload-url.handler';

import { AwsS3Module } from '@shared/services/aws-s3/aws-s3.module';

@Module({
  imports: [AwsS3Module],
  controllers: [CreateImageUploadUrlController],
  providers: [CreateImageUploadUrlHandler],
})
export class CreateImageUploadUrlModule {}
