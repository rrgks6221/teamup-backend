import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ProjectMemberDtoAssembler } from '@module/project/assemblers/project-member-dto.assembler';
import { ProjectMemberResponseDto } from '@module/project/dto/project-member.response-dto';
import { ProjectMember } from '@module/project/entities/project-member.entity';
import { ProjectMemberNotFoundError } from '@module/project/errors/project-member-not-found.error copy';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { GetProjectMemberQuery } from '@module/project/use-cases/get-project-member/get-project-member.query';

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import { ParsePositiveIntStringPipe } from '@common/pipes/positive-int-string.pipe';

@ApiTags('project')
@Controller()
export class GetProjectMemberController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.NOT_FOUND]: [ProjectNotFoundError, ProjectMemberNotFoundError],
  })
  @ApiOperation({ summary: '프로젝트 구성원 단일 조회' })
  @ApiOkResponse({ type: ProjectMemberResponseDto })
  @Get('projects/:projectId/members/:memberId')
  async getProjectMember(
    @Param('projectId', ParsePositiveIntStringPipe) projectId: string,
    @Param('memberId', ParsePositiveIntStringPipe) memberId: string,
  ): Promise<ProjectMemberResponseDto> {
    try {
      const query = new GetProjectMemberQuery({
        projectId,
        memberId,
      });

      const projectMember = await this.queryBus.execute<
        GetProjectMemberQuery,
        ProjectMember
      >(query);

      return ProjectMemberDtoAssembler.convertToDto(projectMember);
    } catch (error) {
      if (
        error instanceof ProjectNotFoundError ||
        error instanceof ProjectMemberNotFoundError
      ) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      throw error;
    }
  }
}
