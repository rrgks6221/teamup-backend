import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { CommentDtoAssembler } from '@module/comment/assemblers/comment-dto.assembler';
import { CommentResponseDto } from '@module/comment/dto/comment.response-dto';
import { Comment } from '@module/comment/entities/comment.entity';
import { UpdateRecruitmentPostCommentRequestDto } from '@module/comment/use-cases/update-recruitment-post-comment/dto/update-recruitment-post-comment.request-dto';
import { UpdateRecruitmentPostCommentCommand } from '@module/comment/use-cases/update-recruitment-post-comment/update-recruitment-post-comment.command';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectRecruitmentPostNotFoundError } from '@module/project/errors/project-recruitment-not-found.error';
import { ProjectRecruitmentPostCommentNotFoundError } from '@module/project/errors/project-recruitment-post-comment-not-found.error';
import { ProjectRecruitmentPostCommentUpdateRestrictedError } from '@module/project/errors/project-recruitment-post-comment-update-restricted.error';

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import {
  CurrentUser,
  ICurrentUser,
} from '@common/decorator/current-user.decorator';
import { ParseNotEmptyObjectPipe } from '@common/pipes/parse-not-empty-object.pipe';
import { ParsePositiveIntStringPipe } from '@common/pipes/positive-int-string.pipe';

@ApiTags('comment')
@Controller()
export class UpdateRecruitmentPostCommentController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.NOT_FOUND]: [
      ProjectNotFoundError,
      ProjectRecruitmentPostNotFoundError,
      ProjectRecruitmentPostCommentNotFoundError,
    ],
    [HttpStatus.FORBIDDEN]: [
      ProjectRecruitmentPostCommentUpdateRestrictedError,
    ],
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: '프로젝트 모집 게시글 댓글 수정' })
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: CommentResponseDto })
  @Patch('projects/:projectId/recruitment-posts/:postId/comments/:commentId')
  async updateRecruitmentPostComment(
    @CurrentUser() currentUser: ICurrentUser,
    @Param('projectId', ParsePositiveIntStringPipe) projectId: string,
    @Param('postId', ParsePositiveIntStringPipe) postId: string,
    @Param('commentId', ParsePositiveIntStringPipe) commentId: string,
    @Body(ParseNotEmptyObjectPipe) body: UpdateRecruitmentPostCommentRequestDto,
  ): Promise<CommentResponseDto> {
    try {
      const command = new UpdateRecruitmentPostCommentCommand({
        currentUserId: currentUser.id,
        projectId,
        postId,
        commentId,
        description: body.description,
      });

      const comment = await this.commandBus.execute<
        UpdateRecruitmentPostCommentCommand,
        Comment
      >(command);

      return CommentDtoAssembler.convertToDto(comment);
    } catch (error) {
      if (
        error instanceof ProjectNotFoundError ||
        error instanceof ProjectRecruitmentPostNotFoundError ||
        error instanceof ProjectRecruitmentPostCommentNotFoundError
      ) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      if (error instanceof ProjectRecruitmentPostCommentUpdateRestrictedError) {
        throw new BaseHttpException(HttpStatus.FORBIDDEN, error);
      }

      throw error;
    }
  }
}
