import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthTokenDtoAssembler } from '@module/auth/assemblers/auth-token-dto.assembler';
import { AuthTokenResponseDto } from '@module/auth/dto/auth-token.response.dto';
import { SignInInfoNotMatchedError } from '@module/auth/errors/sign-in-info-not-matched.error';
import { SignInWithUsernameRequestDto } from '@module/auth/use-cases/sign-in-with-username/dto/sign-in-with-username.request-dto';
import {
  ISignInWithUsernameService,
  SIGN_IN_WITH_USERNAME_SERVICE,
  SignInWithUsernameCommand,
} from '@module/auth/use-cases/sign-in-with-username/sign-in-with-username.service.interface';

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';

@ApiTags('auth')
@Controller('auth')
export class SignInWithUsernameController {
  constructor(
    @Inject(SIGN_IN_WITH_USERNAME_SERVICE)
    private readonly signInWithUsernameService: ISignInWithUsernameService,
  ) {}

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

      const result = await this.signInWithUsernameService.execute(command);

      return AuthTokenDtoAssembler.convertToDto(result);
    } catch (error) {
      if (error instanceof SignInInfoNotMatchedError) {
        throw new BaseHttpException(HttpStatus.FORBIDDEN, error);
      }

      throw error;
    }
  }
}
