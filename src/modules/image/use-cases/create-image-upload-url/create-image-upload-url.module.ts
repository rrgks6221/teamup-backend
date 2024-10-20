import { Module } from '@nestjs/common';

import { CreateImageUploadUrlController } from '@module/image/use-cases/create-image-upload-url/create-image-upload-url.controller';
import { CreateImageUploadUrlService } from '@module/image/use-cases/create-image-upload-url/create-image-upload-url.service';
import { CREATE_IMAGE_UPLOAD_URL_SERVICE } from '@module/image/use-cases/create-image-upload-url/create-image-upload-url.service.interface';

import { AwsS3Module } from '@shared/services/aws-s3/aws-s3.module';

@Module({
  imports: [AwsS3Module],
  controllers: [CreateImageUploadUrlController],
  providers: [
    {
      provide: CREATE_IMAGE_UPLOAD_URL_SERVICE,
      useClass: CreateImageUploadUrlService,
    },
  ],
})
export class CreateImageUploadUrlModule {}
