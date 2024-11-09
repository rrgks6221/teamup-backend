import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthTokenDtoAssembler } from '@module/auth/assemblers/auth-token-dto.assembler';
import { AuthTokenResponseDto } from '@module/auth/dto/auth-token.response.dto';
import { AuthToken } from '@module/auth/entities/auth-token.vo';
import { SignInInfoNotMatchedError } from '@module/auth/errors/sign-in-info-not-matched.error';
import { SignInWithUsernameRequestDto } from '@module/auth/use-cases/sign-in-with-username/dto/sign-in-with-username.request-dto';
import { SignInWithUsernameCommand } from '@module/auth/use-cases/sign-in-with-username/sign-in-with-username.command';

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';

@ApiTags('auth')
@Controller('auth')
export class SignInWithUsernameController {
  constructor(private readonly commandBus: CommandBus) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'username 기반 로그인' })
  @ApiOkResponse({ type: AuthTokenResponseDto })
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.FORBIDDEN]: [SignInInfoNotMatchedError],
  })
  @Post('sign-in/username')
  async signInWithUsername(@Body() body: SignInWithUsernameRequestDto) {
    try {
      const command = new SignInWithUsernameCommand({
        username: body.username,
        password: body.password,
      });

      const result = await this.commandBus.execute<
        SignInWithUsernameCommand,
        AuthToken
      >(command);

      return AuthTokenDtoAssembler.convertToDto(result);
    } catch (error) {
      if (error instanceof SignInInfoNotMatchedError) {
        throw new BaseHttpException(HttpStatus.FORBIDDEN, error);
      }

      throw error;
    }
  }
}
