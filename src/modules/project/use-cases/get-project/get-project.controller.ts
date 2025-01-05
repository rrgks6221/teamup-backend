import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ProjectDtoAssembler } from '@module/project/assemblers/project-dto.assembler';
import { ProjectResponseDto } from '@module/project/dto/project.response-dto';
import { Project } from '@module/project/entities/project.entity';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { GetProjectQuery } from '@module/project/use-cases/get-project/get-project.query';

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';

@ApiTags('project')
@Controller()
export class GetProjectController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.NOT_FOUND]: [ProjectNotFoundError],
  })
  @ApiOperation({ summary: '프로젝트 단일 조회' })
  @ApiOkResponse({ type: ProjectResponseDto })
  @Get('projects/:projectId')
  async getProject(
    @Param('projectId') projectId: string,
  ): Promise<ProjectResponseDto> {
    try {
      const query = new GetProjectQuery({
        projectId,
      });

      const project = await this.queryBus.execute<GetProjectQuery, Project>(
        query,
      );

      return ProjectDtoAssembler.convertToDto(project);
    } catch (error) {
      if (error instanceof ProjectNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      throw error;
    }
  }
}
