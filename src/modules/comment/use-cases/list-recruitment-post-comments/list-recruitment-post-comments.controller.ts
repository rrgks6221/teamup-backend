import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CommentCollectionDtoAssembler } from '@module/comment/assemblers/comment-collection-dto.assembler';
import { CommentCollectionDto } from '@module/comment/dto/comment-collection.dto';
import {
  Comment,
  CommentPostType,
} from '@module/comment/entities/comment.entity';
import { ListRecruitmentPostCommentsRequestDto } from '@module/comment/use-cases/list-recruitment-post-comments/dto/list-recruitment-post-comments.request-dto';
import { ListRecruitmentPostCommentsQuery } from '@module/comment/use-cases/list-recruitment-post-comments/list-recruitment-post-comments.query';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectRecruitmentPostNotFoundError } from '@module/project/errors/project-recruitment-not-found.error';

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import { ICursorPaginated } from '@common/base/base.repository';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import { ParsePositiveIntStringPipe } from '@common/pipes/positive-int-string.pipe';

@ApiTags('project')
@Controller()
export class ListRecruitmentPostCommentsController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.NOT_FOUND]: [
      ProjectNotFoundError,
      ProjectRecruitmentPostNotFoundError,
    ],
  })
  @ApiOkResponse({ type: CommentCollectionDto })
  @ApiOperation({ summary: '모집 게시글 댓글 전체 조회' })
  @Get('projects/:projectId/recruitment-posts/:postId/comments')
  async listRecruitmentPostComments(
    @Param('projectId', ParsePositiveIntStringPipe) projectId: string,
    @Param('postId', ParsePositiveIntStringPipe) postId: string,
    @Query() dto: ListRecruitmentPostCommentsRequestDto,
  ): Promise<CommentCollectionDto> {
    try {
      const query = new ListRecruitmentPostCommentsQuery({
        projectId,
        postId,
        postType: CommentPostType.recruitmentPost,
        cursor: dto.cursor,
        limit: dto.limit,
      });

      const result = await this.queryBus.execute<
        ListRecruitmentPostCommentsQuery,
        ICursorPaginated<Comment>
      >(query);

      return CommentCollectionDtoAssembler.convertToDto(result);
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
}
