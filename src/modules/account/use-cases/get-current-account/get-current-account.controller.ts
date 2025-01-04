import { Controller, Get, HttpStatus, Inject, UseGuards } from '@nestjs/common';
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
  GET_CURRENT_ACCOUNT_SERVICE,
  GetCurrentAccountQuery,
  IGetCurrentAccountService,
} from '@module/account/use-cases/get-current-account/get-current-account.service.interface';
import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';

import { BaseHttpException } from '@common/base/base-http-exception';
import {
  CurrentUser,
  ICurrentUser,
} from '@common/decorator/current-user.decorator';

@ApiTags('account')
@Controller()
export class GetCurrentAccountController {
  constructor(
    @Inject(GET_CURRENT_ACCOUNT_SERVICE)
    private readonly getCurrentAccountService: IGetCurrentAccountService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '내 계정 조회' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: AccountResponseDto })
  @ApiNotFoundResponse({
    schema: BaseHttpException.buildSwaggerSchema([AccountNotFoundError.CODE]),
  })
  @Get('accounts/me')
  async getCurrentAccount(
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<AccountResponseDto> {
    try {
      const query = new GetCurrentAccountQuery({ accountId: currentUser.id });

      const account = await this.getCurrentAccountService.execute(query);

      return AccountDtoAssembler.convertToDto(account);
    } catch (error) {
      if (error instanceof AccountNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      throw error;
    }
  }
}
