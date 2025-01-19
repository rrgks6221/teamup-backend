import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ProjectRecruitmentPostCollectionDtoAssembler } from '@module/project/assemblers/project-recruitment-post-collection-dto.assembler';
import { ProjectRecruitmentPostCollectionDto } from '@module/project/dto/project-recruitment-post-collection.dto';
import { ProjectRecruitmentPost } from '@module/project/entities/project-recruitment-post.entity';
import { ListProjectRecruitmentPostsRequestDto } from '@module/project/use-cases/list-project-recruitment-posts/dto/list-project-recruitment-posts.request-dto';
import { ListProjectRecruitmentPostsQuery } from '@module/project/use-cases/list-project-recruitment-posts/list-project-recruitment-posts.query';

import { RequestValidationError } from '@common/base/base.error';
import { ICursorPaginated } from '@common/base/base.repository';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import { ParsePositiveIntStringPipe } from '@common/pipes/positive-int-string.pipe';

@ApiTags('project')
@Controller()
export class ListProjectRecruitmentPostsController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
  })
  @ApiOperation({
    summary: '프로젝트에 해당하는 프로젝트 모집 게시글 조회',
  })
  @ApiOkResponse({ type: ProjectRecruitmentPostCollectionDto })
  @Get('projects/:projectId/recruitment-posts')
  async listProjectRecruitmentPostsByProjectId(
    @Param('projectId', ParsePositiveIntStringPipe) projectId: string,
    @Query() dto: ListProjectRecruitmentPostsRequestDto,
  ): Promise<ProjectRecruitmentPostCollectionDto> {
    const query = new ListProjectRecruitmentPostsQuery({
      projectId,
      cursor: dto.cursor,
      limit: dto.limit,
    });

    const result = await this.queryBus.execute<
      ListProjectRecruitmentPostsQuery,
      ICursorPaginated<ProjectRecruitmentPost>
    >(query);

    return ProjectRecruitmentPostCollectionDtoAssembler.convertToDto(result);
  }

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
  })
  @ApiOperation({
    summary: '프로젝트 모집 게시글 조회',
    description:
      '프로젝트 식별자와 무관하게 모든 모집 게시글을 조회할 수 있어야하기에 조회에 한해서 recruitment-posts를 최상위 path로 지정함',
  })
  @ApiOkResponse({ type: ProjectRecruitmentPostCollectionDto })
  @Get('recruitment-posts')
  async listProjectRecruitmentPosts(
    @Query() dto: ListProjectRecruitmentPostsRequestDto,
  ): Promise<ProjectRecruitmentPostCollectionDto> {
    const query = new ListProjectRecruitmentPostsQuery({
      cursor: dto.cursor,
      limit: dto.limit,
    });

    const result = await this.queryBus.execute<
      ListProjectRecruitmentPostsQuery,
      ICursorPaginated<ProjectRecruitmentPost>
    >(query);

    return ProjectRecruitmentPostCollectionDtoAssembler.convertToDto(result);
  }
}
