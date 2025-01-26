import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { CommentDtoAssembler } from '@module/comment/assemblers/comment-dto.assembler';
import { CommentResponseDto } from '@module/comment/dto/comment.response-dto';
import {
  Comment,
  CommentPostType,
} from '@module/comment/entities/comment.entity';
import { CreateRecruitmentPostCommentCommand } from '@module/comment/use-cases/create-recruitment-post-comment/create-recruitment-post-comment.command';
import { CreateRecruitmentPostCommentRequestDto } from '@module/comment/use-cases/create-recruitment-post-comment/dto/create-recruitment-post-comment.request-dto';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectRecruitmentPostNotFoundError } from '@module/project/errors/project-recruitment-not-found.error';

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
export class CreateRecruitmentPostCommentController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.NOT_FOUND]: [
      ProjectNotFoundError,
      ProjectRecruitmentPostNotFoundError,
    ],
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: '모집 게시글 댓글 생성' })
  @UseGuards(JwtAuthGuard)
  @Post('projects/:projectId/recruitment-posts/:postId/comments')
  async createRecruitmentPostComment(
    @CurrentUser() currentUser: ICurrentUser,
    @Param('projectId', ParsePositiveIntStringPipe) projectId: string,
    @Param('postId', ParsePositiveIntStringPipe) postId: string,
    @Body() body: CreateRecruitmentPostCommentRequestDto,
  ): Promise<CommentResponseDto> {
    try {
      const command = new CreateRecruitmentPostCommentCommand({
        projectId,
        postId,
        postType: CommentPostType.recruitmentPost,
        authorId: currentUser.id,
        description: body.description,
      });

      const comment = await this.commandBus.execute<
        CreateRecruitmentPostCommentCommand,
        Comment
      >(command);

      return CommentDtoAssembler.convertToDto(comment);
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
