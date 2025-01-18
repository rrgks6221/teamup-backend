import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { PositionNotFoundError } from '@module/position/errors/position-not-found.error';
import { ProjectRecruitmentPostDtoAssembler } from '@module/project/assemblers/project-recruitment-post-dto.assembler';
import { ProjectRecruitmentPostResponseDto } from '@module/project/dto/project-recruitment-post.response-dto';
import { ProjectRecruitmentPost } from '@module/project/entities/project-recruitment-post.entity';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectRecruitmentPostCreationRestrictedError } from '@module/project/errors/project-recruitment-creation-restricted.error';
import { CreateProjectRecruitmentPostCommand } from '@module/project/use-cases/create-project-recruitment-post/create-project-recruitment-post.command';
import { CreateProjectRecruitmentPostRequestDto } from '@module/project/use-cases/create-project-recruitment-post/dto/create-project-recruitment-post.request-dto';
import { TechStackNotFoundError } from '@module/tech-stack/errors/tech-stack-not-found.error';

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
export class CreateProjectRecruitmentPostController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [
      RequestValidationError,
      PositionNotFoundError,
      TechStackNotFoundError,
    ],
    [HttpStatus.NOT_FOUND]: [ProjectNotFoundError],
    [HttpStatus.FORBIDDEN]: [ProjectRecruitmentPostCreationRestrictedError],
  })
  @ApiOperation({ summary: '프로젝트 모집 게시글 생성' })
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ProjectRecruitmentPostResponseDto })
  @UseGuards(JwtAuthGuard)
  @Post('projects/:projectId/recruitment-posts')
  async createProjectRecruitmentPost(
    @CurrentUser() currentUser: ICurrentUser,
    @Param('projectId', ParsePositiveIntStringPipe) projectId: string,
    @Body() body: CreateProjectRecruitmentPostRequestDto,
  ): Promise<ProjectRecruitmentPostResponseDto> {
    try {
      const command = new CreateProjectRecruitmentPostCommand({
        projectId,
        currentUserId: currentUser.id,
        title: body.title,
        description: body.description,
        positionId: body.positionId,
        techStackIds: body.techStackIds,
        maxRecruitsCount: body.maxRecruitsCount,
        applicantsEndsAt: body.applicantsEndsAt,
      });

      const projectRecruitmentPost = await this.commandBus.execute<
        CreateProjectRecruitmentPostCommand,
        ProjectRecruitmentPost
      >(command);

      return ProjectRecruitmentPostDtoAssembler.convertToDto(
        projectRecruitmentPost,
      );
    } catch (error) {
      if (error instanceof ProjectNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      if (
        error instanceof PositionNotFoundError ||
        error instanceof TechStackNotFoundError
      ) {
        throw new BaseHttpException(HttpStatus.BAD_REQUEST, error);
      }

      if (error instanceof ProjectRecruitmentPostCreationRestrictedError) {
        throw new BaseHttpException(HttpStatus.FORBIDDEN, error);
      }

      throw error;
    }
  }
}
