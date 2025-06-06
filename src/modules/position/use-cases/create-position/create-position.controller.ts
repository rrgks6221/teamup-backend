import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PermissionDeniedError } from '@module/auth/errors/permission-denied.error';
import { UnauthorizedUserError } from '@module/auth/errors/unauthorized-user.error';
import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { PositionDtoAssembler } from '@module/position/assemblers/position-dto.assembler';
import { PositionResponseDto } from '@module/position/dto/position.response-dto';
import { Position } from '@module/position/entities/position.entity';
import { PositionAlreadyExistsError } from '@module/position/errors/position-already-exists.error';
import { CreatePositionCommand } from '@module/position/use-cases/create-position/create-position.command';
import { CreatePositionRequestDto } from '@module/position/use-cases/create-position/dto/create-position.request-dto';

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import { AdminGuard } from '@common/guards/admin.guard';

@ApiTags('position')
@Controller()
export class CreatePositionController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: '포지션 생성 어드민 API' })
  @ApiBearerAuth()
  @Post('admin/positions')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedUserError],
    [HttpStatus.FORBIDDEN]: [PermissionDeniedError],
    [HttpStatus.CONFLICT]: [PositionAlreadyExistsError],
  })
  async createPosition(
    @Body() createPositionRequestDto: CreatePositionRequestDto,
  ): Promise<PositionResponseDto> {
    try {
      const command = new CreatePositionCommand({
        name: createPositionRequestDto.name,
      });

      const position = await this.commandBus.execute<
        CreatePositionCommand,
        Position
      >(command);

      return PositionDtoAssembler.convertToDto(position);
    } catch (error) {
      if (error instanceof PositionAlreadyExistsError) {
        throw new BaseHttpException(HttpStatus.CONFLICT, error);
      }

      throw error;
    }
  }
}
