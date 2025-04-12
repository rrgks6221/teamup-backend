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
import { ProjectApplicationDtoAssembler } from '@module/project/assemblers/project-application-dto.assembler';
import { ProjectApplicationResponseDto } from '@module/project/dto/project-application.response-dto';
import { ProjectApplication } from '@module/project/entities/project-application.entity';
import { ProjectApplicationChangeStatusRestrictedError } from '@module/project/errors/project-application-change-status-restricted.error';
import { ProjectApplicationNotFoundError } from '@module/project/errors/project-application-not-found.error';
import { ProjectApplicationValidationError } from '@module/project/errors/project-application-validation.error';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ApproveProjectApplicationCommand } from '@module/project/use-cases/approve-project-application/approve-project-application.command';

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
export class ApproveProjectApplicationController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [
      RequestValidationError,
      ProjectApplicationValidationError,
    ],
    [HttpStatus.FORBIDDEN]: [ProjectApplicationChangeStatusRestrictedError],
    [HttpStatus.NOT_FOUND]: [
      ProjectNotFoundError,
      ProjectApplicationNotFoundError,
    ],
  })
  @ApiOperation({
    summary: '프로젝트 지원서 승인',
    description: '프로젝트 소유자만 승인이 가능함',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProjectApplicationResponseDto })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('projects/:projectId/applications/:applicationId/approve')
  async approveProjectApplication(
    @CurrentUser() currentUser: ICurrentUser,
    @Param('projectId', ParsePositiveIntStringPipe) projectId: string,
    @Param('applicationId', ParsePositiveIntStringPipe) applicationId: string,
  ): Promise<ProjectApplicationResponseDto> {
    try {
      const command = new ApproveProjectApplicationCommand({
        currentUserId: currentUser.id,
        projectId,
        applicationId,
      });

      const application = await this.commandBus.execute<
        ApproveProjectApplicationCommand,
        ProjectApplication
      >(command);

      return ProjectApplicationDtoAssembler.convertToDto(application);
    } catch (error) {
      if (
        error instanceof ProjectNotFoundError ||
        error instanceof ProjectApplicationNotFoundError
      ) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      if (error instanceof ProjectApplicationChangeStatusRestrictedError) {
        throw new BaseHttpException(HttpStatus.FORBIDDEN, error);
      }

      if (error instanceof ProjectApplicationValidationError) {
        throw new BaseHttpException(HttpStatus.BAD_REQUEST, error);
      }

      throw error;
    }
  }
}
