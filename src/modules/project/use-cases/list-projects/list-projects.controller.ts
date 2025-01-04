import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ProjectCollectionDtoAssembler } from '@module/project/assemblers/project-collection-dto.assembler';
import { ProjectCollectionDto } from '@module/project/dto/project-collection.dto';
import { Project } from '@module/project/entities/project.entity';
import { ListProjectsRequestDto } from '@module/project/use-cases/list-projects/dto/list-projects.request-dto';
import { ListProjectsQuery } from '@module/project/use-cases/list-projects/list-projects.query';

import { RequestValidationError } from '@common/base/base.error';
import { ICursorPaginated } from '@common/base/base.repository';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';

@ApiTags('project')
@Controller()
export class ListProjectsController {
  constructor(private readonly queryBus: QueryBus) {}

  /**
   * @todo ordering 지원
   */
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
  })
  @ApiOperation({ summary: '프로젝트 리스트 조회' })
  @ApiOkResponse({ type: ProjectCollectionDto })
  @Get('projects')
  async listProjects(
    @Query() dto: ListProjectsRequestDto,
  ): Promise<ProjectCollectionDto> {
    const query = new ListProjectsQuery({
      cursor: dto.cursor,
      limit: dto.limit,
      statuses: dto.statuses,
    });

    const result = await this.queryBus.execute<
      ListProjectsQuery,
      ICursorPaginated<Project>
    >(query);

    return ProjectCollectionDtoAssembler.convertToDto(result);
  }
}
