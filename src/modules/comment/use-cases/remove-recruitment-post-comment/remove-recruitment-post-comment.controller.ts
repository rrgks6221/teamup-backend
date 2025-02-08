import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { RemoveRecruitmentPostCommentCommand } from '@module/comment/use-cases/remove-recruitment-post-comment/remove-recruitment-post-comment.command';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectRecruitmentPostNotFoundError } from '@module/project/errors/project-recruitment-not-found.error';
import { ProjectRecruitmentPostCommentDeletionRestrictedError } from '@module/project/errors/project-recruitment-post-comment-deletion-restricted.error';
import { ProjectRecruitmentPostCommentNotFoundError } from '@module/project/errors/project-recruitment-post-comment-not-found.error';

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import {
  CurrentUser,
  ICurrentUser,
} from '@common/decorator/current-user.decorator';
import { ParsePositiveIntStringPipe } from '@common/pipes/positive-int-string.pipe';

@ApiTags('project')
@Controller()
export class RemoveRecruitmentPostCommentController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.NOT_FOUND]: [
      ProjectNotFoundError,
      ProjectRecruitmentPostNotFoundError,
      ProjectRecruitmentPostCommentNotFoundError,
    ],
    [HttpStatus.FORBIDDEN]: [
      ProjectRecruitmentPostCommentDeletionRestrictedError,
    ],
  })
  @ApiNoContentResponse()
  @ApiBearerAuth()
  @ApiOperation({ summary: '프로젝트 모집 게시글 댓글 제거' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('projects/:projectId/recruitment-posts/:postId/comments/:commentId')
  async removeRecruitmentPostComment(
    @CurrentUser() currentUser: ICurrentUser,
    @Param('projectId', ParsePositiveIntStringPipe) projectId: string,
    @Param('postId', ParsePositiveIntStringPipe) postId: string,
    @Param('commentId', ParsePositiveIntStringPipe) commentId: string,
  ): Promise<void> {
    try {
      const command = new RemoveRecruitmentPostCommentCommand({
        currentUserId: currentUser.id,
        projectId,
        postId,
        commentId,
      });

      await this.commandBus.execute<RemoveRecruitmentPostCommentCommand, void>(
        command,
      );
    } catch (error) {
      if (
        error instanceof ProjectNotFoundError ||
        error instanceof ProjectRecruitmentPostNotFoundError ||
        error instanceof ProjectRecruitmentPostCommentNotFoundError
      ) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      if (
        error instanceof ProjectRecruitmentPostCommentDeletionRestrictedError
      ) {
        throw new BaseHttpException(HttpStatus.FORBIDDEN, error);
      }

      throw error;
    }
  }
}
