import { Body, Controller, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
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
import { AccountValidationError } from '@module/account/errors/account-validation.error';
import { UpdateAccountRequestDto } from '@module/account/use-cases/update-account/dto/update-account.request-dto';
import { UpdateAccountCommand } from '@module/account/use-cases/update-account/update-account.command';
import { PermissionDeniedError } from '@module/auth/errors/permission-denied.error';
import { UnauthorizedUserError } from '@module/auth/errors/unauthorized-user.error';
import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { PositionNotFoundError } from '@module/position/errors/position-not-found.error';
import { TechStackNotFoundError } from '@module/tech-stack/errors/tech-stack-not-found.error';

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import {
  CurrentUser,
  ICurrentUser,
} from '@common/decorator/current-user.decorator';
import { ParseNotEmptyObjectPipe } from '@common/pipes/parse-not-empty-object.pipe';

@ApiTags('account')
@Controller()
export class UpdateAccountController {
  constructor(private readonly commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '본인 계정 업데이트' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: AccountResponseDto })
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [
      RequestValidationError,
      PositionNotFoundError,
      TechStackNotFoundError,
    ],
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedUserError],
    [HttpStatus.FORBIDDEN]: [PermissionDeniedError],
    [HttpStatus.NOT_FOUND]: [AccountNotFoundError],
    [HttpStatus.UNPROCESSABLE_ENTITY]: [AccountValidationError],
  })
  @Patch('accounts/me')
  async update(
    @CurrentUser() currentUser: ICurrentUser,
    @Body(ParseNotEmptyObjectPipe) body: UpdateAccountRequestDto,
  ): Promise<AccountResponseDto> {
    try {
      const command = new UpdateAccountCommand({
        accountId: currentUser.id,
        name: body.name,
        introduce: body.introduce,
        profileImagePath: body.profileImageUrl?.replace(
          `${process.env.AWS_S3_URL as string}/`,
          '',
        ),
        positionIds: body.positionIds,
        techStackIds: body.techStackIds,
        snsLinks: body.snsLinks,
      });

      const account = await this.commandBus.execute<
        UpdateAccountCommand,
        Account
      >(command);

      return AccountDtoAssembler.convertToDto(account);
    } catch (error) {
      if (error instanceof PermissionDeniedError) {
        throw new BaseHttpException(HttpStatus.FORBIDDEN, error);
      }
      if (error instanceof AccountNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      if (error instanceof AccountValidationError) {
        throw new BaseHttpException(HttpStatus.UNPROCESSABLE_ENTITY, error);
      }

      if (error instanceof PositionNotFoundError) {
        throw new BaseHttpException(HttpStatus.BAD_REQUEST, error);
      }
      if (error instanceof TechStackNotFoundError) {
        throw new BaseHttpException(HttpStatus.BAD_REQUEST, error);
      }

      throw error;
    }
  }
}
