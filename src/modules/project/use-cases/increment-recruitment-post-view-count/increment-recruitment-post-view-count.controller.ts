import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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
import { ProjectRecruitmentPostNotFoundError } from '@module/project/errors/project-recruitment-not-found.error';
import { IncrementRecruitmentPostViewCountCommand } from '@module/project/use-cases/increment-recruitment-post-view-count/increment-recruitment-post-view-count.command';

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import { ParsePositiveIntStringPipe } from '@common/pipes/positive-int-string.pipe';

@ApiTags('project')
@Controller()
export class IncrementRecruitmentPostViewCountController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.NOT_FOUND]: [ProjectRecruitmentPostNotFoundError],
  })
  @ApiOperation({
    summary: '프로젝트 모집 게시글 조회수 증가',
    description:
      '프로젝트 식별자와 무관하게 모집 게시글이 조회될 수 있기에 recruitment-posts를 최상위 path로 지정함',
  })
  @ApiNoContentResponse()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('recruitment-posts/:postId/actions/increment-view-count')
  async incrementRecruitmentPostViewCount(
    @Param('postId', ParsePositiveIntStringPipe) postId: string,
  ): Promise<void> {
    try {
      const command = new IncrementRecruitmentPostViewCountCommand({ postId });

      await this.commandBus.execute<
        IncrementRecruitmentPostViewCountCommand,
        unknown
      >(command);
    } catch (error) {
      if (error instanceof ProjectRecruitmentPostNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      throw error;
    }
  }
}
