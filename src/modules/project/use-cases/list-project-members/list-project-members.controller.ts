import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ProjectMemberCollectionDtoAssembler } from '@module/project/assemblers/project-member-collection-dto.assembler';
import { ProjectMemberCollectionDto } from '@module/project/dto/project-member-collection.dto';
import { ProjectMember } from '@module/project/entities/project-member.entity';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ListProjectMembersRequestDto } from '@module/project/use-cases/list-project-members/dto/list-project-members.request-dto';
import { ListProjectMembersQuery } from '@module/project/use-cases/list-project-members/list-project-members.query';

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import { ICursorPaginated } from '@common/base/base.repository';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';

@ApiTags('project')
@Controller()
export class ListProjectMembersController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.NOT_FOUND]: [ProjectNotFoundError],
  })
  @ApiOperation({ summary: '프로젝트 구성원 조회' })
  @ApiOkResponse({ type: ProjectMemberCollectionDto })
  @Get('projects/:projectId/members')
  async listProjectMembers(
    @Param('projectId') projectId: string,
    @Query() dto: ListProjectMembersRequestDto,
  ): Promise<ProjectMemberCollectionDto> {
    try {
      const query = new ListProjectMembersQuery({
        projectId,
        cursor: dto.cursor,
        limit: dto.limit,
      });

      const result = await this.queryBus.execute<
        ListProjectMembersQuery,
        ICursorPaginated<ProjectMember>
      >(query);

      return ProjectMemberCollectionDtoAssembler.convertToDto(result);
    } catch (error) {
      if (error instanceof ProjectNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      throw error;
    }
  }
}
