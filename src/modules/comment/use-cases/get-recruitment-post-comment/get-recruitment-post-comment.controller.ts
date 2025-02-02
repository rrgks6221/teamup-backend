import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CommentDtoAssembler } from '@module/comment/assemblers/comment-dto.assembler';
import { CommentResponseDto } from '@module/comment/dto/comment.response-dto';
import { Comment } from '@module/comment/entities/comment.entity';
import { GetRecruitmentPostCommentQuery } from '@module/comment/use-cases/get-recruitment-post-comment/get-recruitment-post-comment.query';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectRecruitmentPostNotFoundError } from '@module/project/errors/project-recruitment-not-found.error';
import { ProjectRecruitmentPostCommentNotFoundError } from '@module/project/errors/project-recruitment-post-comment-not-found.error';

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import { ParsePositiveIntStringPipe } from '@common/pipes/positive-int-string.pipe';

@ApiTags('project')
@Controller()
export class GetRecruitmentPostCommentController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.NOT_FOUND]: [
      ProjectNotFoundError,
      ProjectRecruitmentPostNotFoundError,
      ProjectRecruitmentPostCommentNotFoundError,
    ],
  })
  @ApiOkResponse({ type: CommentResponseDto })
  @ApiOperation({ summary: '모집 게시글 댓글 조회' })
  @Get('projects/:projectId/recruitment-posts/:postId/comments/:commentId')
  async getRecruitmentPostComment(
    @Param('projectId', ParsePositiveIntStringPipe) projectId: string,
    @Param('postId', ParsePositiveIntStringPipe) postId: string,
    @Param('commentId', ParsePositiveIntStringPipe) commentId: string,
  ): Promise<CommentResponseDto> {
    try {
      const query = new GetRecruitmentPostCommentQuery({
        projectId,
        postId,
        commentId,
      });

      const comment = await this.queryBus.execute<
        GetRecruitmentPostCommentQuery,
        Comment
      >(query);

      return CommentDtoAssembler.convertToDto(comment);
    } catch (error) {
      if (
        error instanceof ProjectNotFoundError ||
        error instanceof ProjectRecruitmentPostNotFoundError ||
        error instanceof ProjectRecruitmentPostCommentNotFoundError
      ) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      throw error;
    }
  }
}
