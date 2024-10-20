import { ApiProperty } from '@nestjs/swagger';

import { ImageExtension } from '@module/image/entities/image.entity';

import { BaseResponseDto } from '@common/base/base.dto';

export class ImageResponseDto extends BaseResponseDto {
  @ApiProperty({
    description: '이미지 확장자',
    enum: ImageExtension,
  })
  extension: ImageExtension;

  @ApiProperty({
    description: '이미지 확장자',
  })
  contentType: `image/${ImageExtension}`;

  @ApiProperty()
  contentLength: number;

  @ApiProperty()
  md5Hash: string;
}
