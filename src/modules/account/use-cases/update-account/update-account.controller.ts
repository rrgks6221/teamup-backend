import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { AccountDtoAssembler } from '@module/account/assemblers/account-dto.assembler';
import { AccountResponseDto } from '@module/account/dto/account.response-dto';
import { AccountNicknameAlreadyOccupiedError } from '@module/account/errors/account-nickname-already-occupied.error';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import { AccountValidationError } from '@module/account/errors/account-validation.error';
import { UpdateAccountRequestDto } from '@module/account/use-cases/update-account/dto/update-account.request-dto';
import {
  IUpdateAccountService,
  UPDATE_ACCOUNT_SERVICE,
  UpdateAccountCommand,
} from '@module/account/use-cases/update-account/update-account.service.interface';
import { PermissionDeniedError } from '@module/auth/errors/permission-denied.error';
import { UnauthorizedUserError } from '@module/auth/errors/unauthorized-user.error';
import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import {
  CurrentUser,
  ICurrentUser,
} from '@common/decorator/current-user.decorator';
import { NotEmptyObjectPipe } from '@common/pipes/not-empty-object.pipe';

@ApiTags('account')
@Controller()
export class UpdateAccountController {
  constructor(
    @Inject(UPDATE_ACCOUNT_SERVICE)
    private readonly updateAccountService: IUpdateAccountService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '계정 업데이트' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: AccountResponseDto })
  @ApiBadRequestResponse({
    schema: BaseHttpException.buildSwaggerSchema([RequestValidationError.CODE]),
  })
  @ApiUnauthorizedResponse({
    schema: BaseHttpException.buildSwaggerSchema([UnauthorizedUserError.CODE]),
  })
  @ApiForbiddenResponse({
    schema: BaseHttpException.buildSwaggerSchema([PermissionDeniedError.CODE]),
  })
  @ApiNotFoundResponse({
    schema: BaseHttpException.buildSwaggerSchema([AccountNotFoundError.CODE]),
  })
  @ApiConflictResponse({
    schema: BaseHttpException.buildSwaggerSchema([
      AccountNicknameAlreadyOccupiedError.CODE,
    ]),
  })
  @ApiUnprocessableEntityResponse({
    schema: BaseHttpException.buildSwaggerSchema([AccountValidationError.CODE]),
  })
  @Patch('accounts/:id')
  async update(
    @CurrentUser() currentUser: ICurrentUser,
    @Param('id') id: string,
    @Body(NotEmptyObjectPipe) body: UpdateAccountRequestDto,
  ): Promise<AccountResponseDto> {
    try {
      if (currentUser.id !== id) {
        throw new PermissionDeniedError();
      }

      const command = new UpdateAccountCommand({
        accountId: id,
        nickname: body.nickname,
      });

      const account = await this.updateAccountService.execute(command);

      return AccountDtoAssembler.convertToDto(account);
    } catch (error) {
      if (error instanceof PermissionDeniedError) {
        throw new BaseHttpException(HttpStatus.FORBIDDEN, error);
      }
      if (error instanceof AccountNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }
      if (error instanceof AccountNicknameAlreadyOccupiedError) {
        throw new BaseHttpException(HttpStatus.CONFLICT, error);
      }

      if (error instanceof AccountValidationError) {
        throw new BaseHttpException(HttpStatus.UNPROCESSABLE_ENTITY, error);
      }

      throw error;
    }
  }
}
