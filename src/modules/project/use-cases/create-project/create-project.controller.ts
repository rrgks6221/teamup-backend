import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { ProjectDtoAssembler } from '@module/project/assemblers/project-dto.assembler';
import { ProjectResponseDto } from '@module/project/dto/project.response-dto';
import { Project } from '@module/project/entities/project.entity';
import { CreateProjectCommand } from '@module/project/use-cases/create-project/create-project.command';
import { CreateProjectRequestDto } from '@module/project/use-cases/create-project/dto/create-project.request-dto';

import { RequestValidationError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import {
  CurrentUser,
  ICurrentUser,
} from '@common/decorator/current-user.decorator';

@ApiTags('project')
@Controller()
export class CreateProjectController {
  constructor(private readonly commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '프로젝트 생성' })
  @ApiCreatedResponse({ type: ProjectResponseDto })
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
  })
  @Post('projects')
  async createProject(
    @CurrentUser() currentUser: ICurrentUser,
    @Body() body: CreateProjectRequestDto,
  ): Promise<ProjectResponseDto> {
    const command = new CreateProjectCommand({
      ownerId: currentUser.id,
      name: body.name,
      description: body.description,
      category: body.category,
      maxMemberCount: body.maxMemberCount,
      tags: body.tags,
    });

    const project = await this.commandBus.execute<
      CreateProjectCommand,
      Project
    >(command);

    return ProjectDtoAssembler.convertToDto(project);
  }
}
