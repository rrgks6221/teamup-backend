import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AccountDtoAssembler } from '@module/account/assemblers/account-dto.assembler';
import { AccountResponseDto } from '@module/account/dto/account.response-dto';
import { Account } from '@module/account/entities/account.entity';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import { GetAccountQuery } from '@module/account/use-cases/get-account/get-account.query';
import { UnauthorizedUserError } from '@module/auth/errors/unauthorized-user.error';
import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';

import { BaseHttpException } from '@common/base/base-http-exception';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import {
  CurrentUser,
  ICurrentUser,
} from '@common/decorator/current-user.decorator';
import { ParsePositiveIntStringPipe } from '@common/pipes/positive-int-string.pipe';

@ApiTags('account')
@ApiOkResponse({ type: AccountResponseDto })
@Controller()
export class GetAccountController {
  constructor(private readonly queryBus: QueryBus) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '내 계정 조회' })
  @ApiBearerAuth()
  @ApiErrorResponse({
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedUserError],
    [HttpStatus.NOT_FOUND]: [AccountNotFoundError],
  })
  @Get('accounts/me')
  async getCurrentAccount(
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<AccountResponseDto> {
    try {
      const query = new GetAccountQuery({ id: currentUser.id });

      const account = await this.queryBus.execute<GetAccountQuery, Account>(
        query,
      );

      return AccountDtoAssembler.convertToDto(account);
    } catch (error) {
      if (error instanceof AccountNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      throw error;
    }
  }

  @ApiErrorResponse({
    [HttpStatus.NOT_FOUND]: [AccountNotFoundError],
  })
  @ApiOperation({ summary: '특정 계정 조회' })
  @Get('accounts/:id')
  async getAccount(
    @Param('id', ParsePositiveIntStringPipe) id: string,
  ): Promise<AccountResponseDto> {
    try {
      const query = new GetAccountQuery({ id });

      const account = await this.queryBus.execute<GetAccountQuery, Account>(
        query,
      );

      return AccountDtoAssembler.convertToDto(account);
    } catch (error) {
      if (error instanceof AccountNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      throw error;
    }
  }
}
