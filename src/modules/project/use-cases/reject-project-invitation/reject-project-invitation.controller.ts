import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { ProjectInvitationDtoAssembler } from '@module/project/assemblers/project-invitation-dto.assembler';
import { ProjectInvitationResponseDto } from '@module/project/dto/project-invitation.response-dto';
import { ProjectInvitation } from '@module/project/entities/project-invitation.entity';
import { ProjectInvitationChangeStatusRestrictedError } from '@module/project/errors/project-invitation-change-status-restricted.error';
import { ProjectInvitationNotFoundError } from '@module/project/errors/project-invitation-not-found.error';
import { ProjectInvitationValidationError } from '@module/project/errors/project-invitation-validation.error';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { RejectProjectInvitationCommand } from '@module/project/use-cases/reject-project-invitation/reject-project-invitation.command';

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
export class RejectProjectInvitationController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [
      RequestValidationError,
      ProjectInvitationValidationError,
    ],
    [HttpStatus.FORBIDDEN]: [ProjectInvitationChangeStatusRestrictedError],
    [HttpStatus.NOT_FOUND]: [
      ProjectNotFoundError,
      ProjectInvitationNotFoundError,
    ],
  })
  @ApiOperation({
    summary: '프로젝트 초대장 거절',
    description: '프로젝트에 초대받은 사람만 거절이 가능함',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProjectInvitationResponseDto })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('projects/:projectId/invitations/:invitationId/reject')
  async rejectProjectInvitation(
    @CurrentUser() currentUser: ICurrentUser,
    @Param('projectId', ParsePositiveIntStringPipe) projectId: string,
    @Param('invitationId', ParsePositiveIntStringPipe) invitationId: string,
  ): Promise<ProjectInvitationResponseDto> {
    try {
      const command = new RejectProjectInvitationCommand({
        currentUserId: currentUser.id,
        projectId,
        invitationId,
      });

      const invitation = await this.commandBus.execute<
        RejectProjectInvitationCommand,
        ProjectInvitation
      >(command);

      return ProjectInvitationDtoAssembler.convertToDto(invitation);
    } catch (error) {
      if (
        error instanceof ProjectNotFoundError ||
        error instanceof ProjectInvitationNotFoundError
      ) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      if (error instanceof ProjectInvitationChangeStatusRestrictedError) {
        throw new BaseHttpException(HttpStatus.FORBIDDEN, error);
      }

      if (error instanceof ProjectInvitationValidationError) {
        throw new BaseHttpException(HttpStatus.BAD_REQUEST, error);
      }

      throw error;
    }
  }
}
