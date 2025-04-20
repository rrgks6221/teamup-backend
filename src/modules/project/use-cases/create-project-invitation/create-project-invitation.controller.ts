import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { PositionNotFoundError } from '@module/position/errors/position-not-found.error';
import { ProjectInvitationDtoAssembler } from '@module/project/assemblers/project-invitation-dto.assembler';
import { ProjectInvitationResponseDto } from '@module/project/dto/project-invitation.response-dto';
import { ProjectInvitation } from '@module/project/entities/project-invitation.entity';
import { ProjectInvitationCreationRestrictedError } from '@module/project/errors/project-invitation-creation-restricted.error';
import { ProjectMemberAlreadyExistsError } from '@module/project/errors/project-member-already-exists.error';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { CreateProjectInvitationCommand } from '@module/project/use-cases/create-project-invitation/create-project-invitation.command';
import { CreateProjectInvitationRequestDto } from '@module/project/use-cases/create-project-invitation/dto/create-project-invitation.request-dto';

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
export class CreateProjectInvitationController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [
      RequestValidationError,
      AccountNotFoundError,
      ProjectMemberAlreadyExistsError,
      ProjectInvitationCreationRestrictedError,
      PositionNotFoundError,
    ],
    [HttpStatus.NOT_FOUND]: [ProjectNotFoundError],
  })
  @ApiOperation({ summary: '프로젝트에 초대하기' })
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ProjectInvitationResponseDto })
  @UseGuards(JwtAuthGuard)
  @Post('projects/:projectId/invitations')
  async createProjectInvitation(
    @CurrentUser() currentUser: ICurrentUser,
    @Param('projectId', ParsePositiveIntStringPipe) projectId: string,
    @Body() body: CreateProjectInvitationRequestDto,
  ): Promise<ProjectInvitationResponseDto> {
    try {
      const command = new CreateProjectInvitationCommand({
        projectId,
        inviterId: currentUser.id,
        inviteeId: body.inviteeId,
        positionName: body.positionName,
      });

      const projectInvitation = await this.commandBus.execute<
        CreateProjectInvitationCommand,
        ProjectInvitation
      >(command);

      return ProjectInvitationDtoAssembler.convertToDto(projectInvitation);
    } catch (error) {
      if (error instanceof ProjectNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      if (
        error instanceof AccountNotFoundError ||
        error instanceof ProjectMemberAlreadyExistsError ||
        error instanceof ProjectInvitationCreationRestrictedError ||
        error instanceof PositionNotFoundError
      ) {
        throw new BaseHttpException(HttpStatus.BAD_REQUEST, error);
      }

      throw error;
    }
  }
}
