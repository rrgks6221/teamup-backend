import { Controller, Get, HttpStatus, Inject, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AccountDtoAssembler } from '@module/account/assemblers/account-dto.assembler';
import { AccountResponseDto } from '@module/account/dto/account.response-dto';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import {
  GET_ACCOUNT_SERVICE,
  GetAccountQuery,
  IGetAccountService,
} from '@module/account/use-cases/get-account/get-account.service.interface';

import { BaseHttpException } from '@common/base/base-http-exception';

@ApiTags('accounts')
@Controller()
export class GetAccountController {
  constructor(
    @Inject(GET_ACCOUNT_SERVICE)
    private readonly getAccountService: IGetAccountService,
  ) {}

  @ApiOperation({ summary: '특정 계정 조회' })
  @ApiOkResponse({ type: AccountResponseDto })
  @ApiNotFoundResponse({
    schema: BaseHttpException.buildSwaggerSchema([AccountNotFoundError.CODE]),
  })
  @Get('accounts/:id')
  async getAccount(@Param('id') id: string): Promise<AccountResponseDto> {
    try {
      const query = new GetAccountQuery({ id });

      const account = await this.getAccountService.execute(query);

      return AccountDtoAssembler.convertToDto(account);
    } catch (error) {
      if (error instanceof AccountNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      throw error;
    }
  }
}
