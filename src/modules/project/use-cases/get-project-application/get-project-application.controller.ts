import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
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
import { ProjectApplicationNotFoundError } from '@module/project/errors/project-application-not-found.error';
import { ProjectApplicationViewRestrictedError } from '@module/project/errors/project-application-view-restricted.error';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { GetProjectApplicationQuery } from '@module/project/use-cases/get-project-application/get-project-application.query';

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import {
  CurrentUser,
  ICurrentUser,
} from '@common/decorator/current-user.decorator';

@ApiTags('project')
@Controller()
export class GetProjectApplicationController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.FORBIDDEN]: [ProjectApplicationViewRestrictedError],
    [HttpStatus.NOT_FOUND]: [
      ProjectNotFoundError,
      ProjectApplicationNotFoundError,
    ],
  })
  @ApiOperation({ summary: '프로젝트 지원서 단일 조회' })
  @ApiOkResponse({ type: ProjectApplicationResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('projects/:projectId/applications/:applicationId')
  async getProjectApplication(
    @CurrentUser() currentUser: ICurrentUser,
    @Param('projectId') projectId: string,
    @Param('applicationId') applicationId: string,
  ): Promise<ProjectApplicationResponseDto> {
    try {
      const query = new GetProjectApplicationQuery({
        currentUserId: currentUser.id,
        projectId,
        applicationId,
      });

      const projectApplication = await this.queryBus.execute<
        GetProjectApplicationQuery,
        ProjectApplication
      >(query);

      return ProjectApplicationDtoAssembler.convertToDto(projectApplication);
    } catch (error) {
      if (
        error instanceof ProjectNotFoundError ||
        error instanceof ProjectApplicationNotFoundError
      ) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      if (error instanceof ProjectApplicationViewRestrictedError) {
        throw new BaseHttpException(HttpStatus.FORBIDDEN, error);
      }

      throw error;
    }
  }
}
