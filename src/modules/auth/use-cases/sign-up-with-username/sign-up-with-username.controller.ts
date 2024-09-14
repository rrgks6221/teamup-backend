import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AccountUsernameAlreadyOccupiedError } from '@module/account/errors/account-username-already-occupied.error';
import { AccountValidationError } from '@module/account/errors/account-validation.error';
import { AuthTokenDtoAssembler } from '@module/auth/assemblers/auth-token-dto.assembler';
import { AuthTokenResponseDto } from '@module/auth/dto/auth-token.response.dto';
import { SignUpWithUsernameRequestDto } from '@module/auth/use-cases/sign-up-with-username/dto/sign-up-with-username.request-dto';
import {
  ISignUpWithUsernameService,
  SIGN_UP_WITH_USERNAME_SERVICE,
  SignUpWithUsernameCommand,
} from '@module/auth/use-cases/sign-up-with-username/sign-up-with-username.service.interface';

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';

@ApiTags('auth')
@Controller('auth')
export class SignUpWithUsernameController {
  constructor(
    @Inject(SIGN_UP_WITH_USERNAME_SERVICE)
    private readonly signUpWithUsernameService: ISignUpWithUsernameService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'username 기반 회원가입' })
  @ApiOkResponse({ type: AuthTokenResponseDto })
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError, AccountValidationError],
    [HttpStatus.CONFLICT]: [AccountUsernameAlreadyOccupiedError],
  })
  @Post('sign-up/username')
  async signUpWithUsername(@Body() body: SignUpWithUsernameRequestDto) {
    try {
      const command = new SignUpWithUsernameCommand({
        username: body.username,
        password: body.password,
      });

      const result = await this.signUpWithUsernameService.execute(command);

      return AuthTokenDtoAssembler.convertToDto(result);
    } catch (error) {
      if (error instanceof AccountValidationError) {
        throw new BaseHttpException(HttpStatus.BAD_REQUEST, error);
      }

      if (error instanceof AccountUsernameAlreadyOccupiedError) {
        throw new BaseHttpException(HttpStatus.CONFLICT, error);
      }

      throw error;
    }
  }
}
