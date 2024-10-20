import { ApiProperty } from '@nestjs/swagger';

import { IsBase64, IsEnum, IsInt, IsString, Max } from 'class-validator';

import { Image, ImageExtension } from '@module/image/entities/image.entity';

export class CreateImageUploadUrlRequestDto {
  @ApiProperty({
    enum: ImageExtension,
  })
  @IsEnum(ImageExtension)
  @IsString()
  extension: ImageExtension;

  @ApiProperty({
    description: '이미지 파일 크기',
    maximum: Image.MAX_SIZE_IN_BYTE,
  })
  @Max(Image.MAX_SIZE_IN_BYTE)
  @IsInt()
  contentLength: number;

  @ApiProperty({
    description: '이미지에 대한 md5 해시 값 base64 포맷',
    format: 'base64',
  })
  @IsBase64()
  @IsString()
  md5Hash: string;
}
