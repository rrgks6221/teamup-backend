import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { ProjectApplicationCollectionDtoAssembler } from '@module/project/assemblers/project-application-collection-dto.assembler';
import { ProjectApplicationCollectionDto } from '@module/project/dto/project-application-collection.dto';
import { ProjectApplication } from '@module/project/entities/project-application.entity';
import { ProjectApplicationViewRestrictedError } from '@module/project/errors/project-application-view-restricted.error';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ListProjectApplicationsRequestDto } from '@module/project/use-cases/list-project-applications/dto/list-project-applications.request-dto';
import { ListProjectApplicationsQuery } from '@module/project/use-cases/list-project-applications/list-project-applications.query';

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import { ICursorPaginated } from '@common/base/base.repository';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import {
  CurrentUser,
  ICurrentUser,
} from '@common/decorator/current-user.decorator';

@ApiTags('project')
@Controller()
export class ListProjectApplicationsController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.FORBIDDEN]: [ProjectApplicationViewRestrictedError],
    [HttpStatus.NOT_FOUND]: [ProjectNotFoundError],
  })
  @ApiOperation({ summary: '프로젝트 지원서 목록 조회' })
  @ApiOkResponse({ type: ProjectApplicationCollectionDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('projects/:projectId/applications')
  async listProjectApplications(
    @CurrentUser() currentUser: ICurrentUser,
    @Param('projectId') projectId: string,
    @Query() dto: ListProjectApplicationsRequestDto,
  ): Promise<ProjectApplicationCollectionDto> {
    try {
      const query = new ListProjectApplicationsQuery({
        currentUserId: currentUser.id,
        projectId: projectId,
        limit: dto.limit,
        cursor: dto.cursor,
        statuses: dto.statuses,
      });

      const result = await this.queryBus.execute<
        ListProjectApplicationsQuery,
        ICursorPaginated<ProjectApplication>
      >(query);

      return ProjectApplicationCollectionDtoAssembler.convertToDto(result);
    } catch (error) {
      if (error instanceof ProjectNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      if (error instanceof ProjectApplicationViewRestrictedError) {
        throw new BaseHttpException(HttpStatus.FORBIDDEN, error);
      }

      throw error;
    }
  }
}
