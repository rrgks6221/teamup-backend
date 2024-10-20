import { ApiProperty } from '@nestjs/swagger';

import { ImageResponseDto } from '@module/image/dto/image.response-dto';

export class PreUploadImageResponseDto extends ImageResponseDto {
  @ApiProperty({
    description: '업로드 url 유효시간',
  })
  uploadUrlExpiresIn: number;

  @ApiProperty({
    description: '이미지 업로드 url',
  })
  uploadUrl: string;

  @ApiProperty({
    description: '이미지 업로드 rest API method',
  })
  uploadMethod: string;

  @ApiProperty({
    description: '업로드 url을 통해 업로드된 이미지 url',
  })
  uploadedUrl: string;
}
