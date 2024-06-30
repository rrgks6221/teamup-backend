import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
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
import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';

import { BaseHttpException } from '@common/base/base-http-exception';
import {
  CurrentUser,
  ICurrentUser,
} from '@common/decorator/current-user.decorator';

@ApiTags('account')
@ApiOkResponse({ type: AccountResponseDto })
@ApiNotFoundResponse({
  schema: BaseHttpException.buildSwaggerSchema([AccountNotFoundError.CODE]),
})
@Controller()
export class GetAccountController {
  constructor(
    @Inject(GET_ACCOUNT_SERVICE)
    private readonly getAccountService: IGetAccountService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '내 계정 조회' })
  @ApiBearerAuth()
  @Get('accounts/me')
  async getCurrentAccount(
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<AccountResponseDto> {
    try {
      const query = new GetAccountQuery({ id: currentUser.id });

      const account = await this.getAccountService.execute(query);

      return AccountDtoAssembler.convertToDto(account);
    } catch (error) {
      if (error instanceof AccountNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      throw error;
    }
  }

  @ApiOperation({ summary: '특정 계정 조회' })
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
