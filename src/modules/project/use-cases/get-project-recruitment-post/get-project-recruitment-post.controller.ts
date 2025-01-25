import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ProjectRecruitmentPostDtoAssembler } from '@module/project/assemblers/project-recruitment-post-dto.assembler';
import { ProjectRecruitmentPostResponseDto } from '@module/project/dto/project-recruitment-post.response-dto';
import { ProjectRecruitmentPost } from '@module/project/entities/project-recruitment-post.entity';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectRecruitmentPostNotFoundError } from '@module/project/errors/project-recruitment-not-found.error';
import { GetProjectRecruitmentPostQuery } from '@module/project/use-cases/get-project-recruitment-post/get-project-recruitment-post.query';

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import { ParsePositiveIntStringPipe } from '@common/pipes/positive-int-string.pipe';

@ApiTags('project')
@Controller()
export class GetProjectRecruitmentPostController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.NOT_FOUND]: [
      ProjectNotFoundError,
      ProjectRecruitmentPostNotFoundError,
    ],
  })
  @ApiOperation({
    summary: '프로젝트 모집 게시글 단일 조회',
  })
  @ApiOkResponse({ type: ProjectRecruitmentPostResponseDto })
  @Get('projects/:projectId/recruitment-posts/:postId')
  async getProjectRecruitmentPostByProjectId(
    @Param('projectId', ParsePositiveIntStringPipe) projectId: string,
    @Param('postId', ParsePositiveIntStringPipe) postId: string,
  ): Promise<ProjectRecruitmentPostResponseDto> {
    try {
      const query = new GetProjectRecruitmentPostQuery({
        projectId,
        projectRecruitmentPostId: postId,
      });

      const projectRecruitmentPost = await this.queryBus.execute<
        GetProjectRecruitmentPostQuery,
        ProjectRecruitmentPost
      >(query);

      return ProjectRecruitmentPostDtoAssembler.convertToDto(
        projectRecruitmentPost,
      );
    } catch (error) {
      if (
        error instanceof ProjectNotFoundError ||
        error instanceof ProjectRecruitmentPostNotFoundError
      ) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      throw error;
    }
  }

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.NOT_FOUND]: [ProjectRecruitmentPostNotFoundError],
  })
  @ApiOperation({
    summary: '프로젝트 모집 게시글 단일 조회',
    description:
      '프로젝트 식별자와 무관하게 모집 게시글을 조회할 수 있어야하기에 조회에 한해서 recruitment-posts를 최상위 path로 지정함',
  })
  @ApiOkResponse({ type: ProjectRecruitmentPostResponseDto })
  @Get('recruitment-posts/:postId')
  async getProjectRecruitmentPost(
    @Param('postId', ParsePositiveIntStringPipe) postId: string,
  ): Promise<ProjectRecruitmentPostResponseDto> {
    try {
      const query = new GetProjectRecruitmentPostQuery({
        projectRecruitmentPostId: postId,
      });

      const projectRecruitmentPost = await this.queryBus.execute<
        GetProjectRecruitmentPostQuery,
        ProjectRecruitmentPost
      >(query);

      return ProjectRecruitmentPostDtoAssembler.convertToDto(
        projectRecruitmentPost,
      );
    } catch (error) {
      if (error instanceof ProjectRecruitmentPostNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      throw error;
    }
  }
}
