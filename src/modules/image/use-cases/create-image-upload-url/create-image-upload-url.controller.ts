import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { PermissionDeniedError } from '@module/auth/errors/permission-denied.error';
import { UnauthorizedUserError } from '@module/auth/errors/unauthorized-user.error';
import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { ImageDtoAssembler } from '@module/image/assemblers/image-dto.assembler';
import { PreUploadImageResponseDto } from '@module/image/dto/pre-upload-image.response-dto';
import { Image } from '@module/image/entities/image.entity';
import { CreateImageUploadUrlCommand } from '@module/image/use-cases/create-image-upload-url/create-image-upload-url.command';
import { CreateImageUploadUrlRequestDto } from '@module/image/use-cases/create-image-upload-url/dto/create-image-upload-url.request-dto';

import { RequestValidationError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';

@ApiTags('image')
@Controller()
export class CreateImageUploadUrlController {
  constructor(private readonly commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '이미지를 업로드 할 수 있는 url 생성' })
  @ApiOkResponse({ type: PreUploadImageResponseDto })
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedUserError],
    [HttpStatus.FORBIDDEN]: [PermissionDeniedError],
  })
  @Post('images/pre-upload-url')
  async createImageUploadUrl(
    @Body() body: CreateImageUploadUrlRequestDto,
  ): Promise<PreUploadImageResponseDto> {
    const command = new CreateImageUploadUrlCommand({
      extension: body.extension,
      contentLength: body.contentLength,
      md5Hash: body.md5Hash,
    });

    const image = await this.commandBus.execute<
      CreateImageUploadUrlCommand,
      Image
    >(command);

    return ImageDtoAssembler.convertToPreUploadDto(image);
  }
}
