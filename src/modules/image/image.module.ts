import { Module } from '@nestjs/common';

import { CreateImageUploadUrlModule } from '@module/image/use-cases/create-image-upload-url/create-image-upload-url.module';

@Module({
  imports: [CreateImageUploadUrlModule],
})
export class ImageModule {}
