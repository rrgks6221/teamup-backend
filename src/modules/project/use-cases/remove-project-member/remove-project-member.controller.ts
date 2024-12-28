import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { ProjectMemberDeletionRestrictedError } from '@module/project/errors/project-member-deletion-restricted.error';
import { ProjectMemberNotFoundError } from '@module/project/errors/project-member-not-found.error copy';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { RemoveProjectMemberCommand } from '@module/project/use-cases/remove-project-member/remove-project-member.command';

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import {
  CurrentUser,
  ICurrentUser,
} from '@common/decorator/current-user.decorator';
import { ParsePositiveIntStringPipe } from '@common/pipes/positive-int-string.pipe';

@ApiTags('project')
@Controller()
export class RemoveProjectMemberController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.FORBIDDEN]: [ProjectMemberDeletionRestrictedError],
    [HttpStatus.NOT_FOUND]: [ProjectNotFoundError, ProjectMemberNotFoundError],
  })
  @ApiNoContentResponse()
  @ApiBearerAuth()
  @ApiOperation({ summary: '구성원 제거' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('projects/:projectId/members/:memberId')
  async removeProjectMember(
    @CurrentUser() currentUser: ICurrentUser,
    @Param('projectId', ParsePositiveIntStringPipe) projectId: string,
    @Param('memberId', ParsePositiveIntStringPipe) memberId: string,
  ): Promise<void> {
    try {
      const command = new RemoveProjectMemberCommand({
        currentUserId: currentUser.id,
        projectId,
        memberId,
      });

      await this.commandBus.execute<RemoveProjectMemberCommand, void>(command);
    } catch (error) {
      if (
        error instanceof ProjectNotFoundError ||
        error instanceof ProjectMemberNotFoundError
      ) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      if (error instanceof ProjectMemberDeletionRestrictedError) {
        throw new BaseHttpException(HttpStatus.FORBIDDEN, error);
      }

      throw error;
    }
  }
}
