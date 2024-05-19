import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Param,
  Patch,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
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

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import { NotEmptyObjectPipe } from '@common/pipes/not-empty-object.pipe';

@ApiTags('accounts')
@Controller()
export class UpdateAccountController {
  constructor(
    @Inject(UPDATE_ACCOUNT_SERVICE)
    private readonly updateAccountService: IUpdateAccountService,
  ) {}

  /**
   * @todo 본인만 계정 업데이트 가능하게 변경
   */
  @ApiOperation({ summary: '계정 업데이트' })
  @ApiOkResponse({ type: AccountResponseDto })
  @ApiBadRequestResponse({
    schema: BaseHttpException.buildSwaggerSchema([RequestValidationError.CODE]),
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
    @Param('id') id: string,
    @Body(NotEmptyObjectPipe) body: UpdateAccountRequestDto,
  ): Promise<AccountResponseDto> {
    try {
      const command = new UpdateAccountCommand({
        accountId: id,
        nickname: body.nickname,
      });

      const account = await this.updateAccountService.execute(command);

      return AccountDtoAssembler.convertToDto(account);
    } catch (error) {
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
