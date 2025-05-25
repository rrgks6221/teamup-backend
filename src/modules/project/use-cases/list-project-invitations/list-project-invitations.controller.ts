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
import { ProjectInvitationCollectionDtoAssembler } from '@module/project/assemblers/project-invitation-collection-dto.assembler';
import { ProjectInvitationCollectionDto } from '@module/project/dto/project-invitation-collection.dto';
import { ProjectInvitation } from '@module/project/entities/project-invitation.entity';
import { ProjectInvitationViewRestrictedError } from '@module/project/errors/project-invitation-view-restricted.error';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ListProjectInvitationsRequestDto } from '@module/project/use-cases/list-project-invitations/dto/list-project-invitations.request-dto';
import { ListProjectInvitationsQuery } from '@module/project/use-cases/list-project-invitations/list-project-invitations.query';

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
export class ListProjectInvitationsController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.FORBIDDEN]: [ProjectInvitationViewRestrictedError],
    [HttpStatus.NOT_FOUND]: [ProjectNotFoundError],
  })
  @ApiOperation({ summary: '프로젝트 초대장 목록 조회' })
  @ApiOkResponse({ type: ProjectInvitationCollectionDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('projects/:projectId/applications')
  async listProjectInvitations(
    @CurrentUser() currentUser: ICurrentUser,
    @Param('projectId') projectId: string,
    @Query() dto: ListProjectInvitationsRequestDto,
  ): Promise<ProjectInvitationCollectionDto> {
    try {
      const query = new ListProjectInvitationsQuery({
        currentUserId: currentUser.id,
        projectId,
        cursor: dto.cursor,
        limit: dto.limit,
        statuses: dto.statuses,
      });

      const result = await this.queryBus.execute<
        ListProjectInvitationsQuery,
        ICursorPaginated<ProjectInvitation>
      >(query);

      return ProjectInvitationCollectionDtoAssembler.convertToDto(result);
    } catch (error) {
      if (error instanceof ProjectNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      if (error instanceof ProjectInvitationViewRestrictedError) {
        throw new BaseHttpException(HttpStatus.FORBIDDEN, error);
      }

      throw error;
    }
  }
}
