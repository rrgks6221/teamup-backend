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

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { PositionNotFoundError } from '@module/position/errors/position-not-found.error';
import { ProjectApplicationDtoAssembler } from '@module/project/assemblers/project-application-dto.assembler';
import { ProjectApplicationResponseDto } from '@module/project/dto/project-application.response-dto';
import { ProjectApplication } from '@module/project/entities/project-application.entity';
import { ProjectApplicationCreationRestrictedError } from '@module/project/errors/project-application-creation-restricted.error';
import { ProjectMemberAlreadyExistsError } from '@module/project/errors/project-member-already-exists.error';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { CreateProjectApplicationCommand } from '@module/project/use-cases/create-project-application/create-project-application.command';
import { CreateProjectApplicationRequestDto } from '@module/project/use-cases/create-project-application/dto/create-project-application.request-dto';

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
export class CreateProjectApplicationController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [
      RequestValidationError,
      ProjectMemberAlreadyExistsError,
      ProjectApplicationCreationRestrictedError,
      PositionNotFoundError,
    ],
    [HttpStatus.NOT_FOUND]: [ProjectNotFoundError],
  })
  @ApiOperation({ summary: '프로젝트에 지원하기' })
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ProjectApplicationResponseDto })
  @UseGuards(JwtAuthGuard)
  @Post('projects/:projectId/applications')
  async createProjectApplication(
    @CurrentUser() currentUser: ICurrentUser,
    @Param('projectId', ParsePositiveIntStringPipe) projectId: string,
    @Body() body: CreateProjectApplicationRequestDto,
  ): Promise<ProjectApplicationResponseDto> {
    try {
      const command = new CreateProjectApplicationCommand({
        projectId,
        applicantId: currentUser.id,
        positionId: body.positionId,
      });

      const projectApplication = await this.commandBus.execute<
        CreateProjectApplicationCommand,
        ProjectApplication
      >(command);

      return ProjectApplicationDtoAssembler.convertToDto(projectApplication);
    } catch (error) {
      if (error instanceof ProjectNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      if (
        error instanceof ProjectMemberAlreadyExistsError ||
        error instanceof ProjectApplicationCreationRestrictedError ||
        error instanceof PositionNotFoundError
      ) {
        throw new BaseHttpException(HttpStatus.BAD_REQUEST, error);
      }

      throw error;
    }
  }
}
