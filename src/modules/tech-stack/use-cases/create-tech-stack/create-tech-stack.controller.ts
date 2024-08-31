import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PermissionDeniedError } from '@module/auth/errors/permission-denied.error';
import { UnauthorizedUserError } from '@module/auth/errors/unauthorized-user.error';
import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { TechStackDtoAssembler } from '@module/tech-stack/assemblers/tech-stack-dto.assembler';
import { TechStackResponseDto } from '@module/tech-stack/dto/tech-stack.response-dto';
import { TechStackAlreadyExistsError } from '@module/tech-stack/errors/tech-stack-already-exists.error';
import {
  CREATE_TECH_STACK_SERVICE,
  CreateTechStackCommand,
  ICreateTechStackService,
} from '@module/tech-stack/use-cases/create-tech-stack/create-tech-stack.service.interface';
import { CreateTechStackRequestDto } from '@module/tech-stack/use-cases/create-tech-stack/dto/create-tech-stack.request-dto';

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import { AdminGuard } from '@common/guards/admin.guard';

@ApiTags('tech-stack')
@Controller()
export class CreateTechStackController {
  constructor(
    @Inject(CREATE_TECH_STACK_SERVICE)
    private readonly createTechStackService: ICreateTechStackService,
  ) {}

  @ApiOperation({ summary: '기술 스택 생성 어드민 API' })
  @ApiBearerAuth()
  @Post('admin/tech-stacks')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedUserError],
    [HttpStatus.FORBIDDEN]: [PermissionDeniedError],
    [HttpStatus.CONFLICT]: [TechStackAlreadyExistsError],
  })
  async createTechStack(
    @Body() createTechStackRequestDto: CreateTechStackRequestDto,
  ): Promise<TechStackResponseDto> {
    try {
      const command = new CreateTechStackCommand({
        name: createTechStackRequestDto.name,
      });

      const techStack = await this.createTechStackService.execute(command);

      return TechStackDtoAssembler.convertToDto(techStack);
    } catch (error) {
      if (error instanceof TechStackAlreadyExistsError) {
        throw new BaseHttpException(HttpStatus.CONFLICT, error);
      }

      throw error;
    }
  }
}
