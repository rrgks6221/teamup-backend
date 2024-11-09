import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { TechStackDtoAssembler } from '@module/tech-stack/assemblers/tech-stack-dto.assembler';
import { TechStackResponseDto } from '@module/tech-stack/dto/tech-stack.response-dto';
import { TechStack } from '@module/tech-stack/entities/tech-stack.entity';
import { ListTechStacksQuery } from '@module/tech-stack/use-cases/list-tech-stacks/list-tech-stacks.query';

@ApiTags('tech-stack')
@Controller()
export class ListTechStacksController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiOperation({ summary: '기술스택 리스트 조회' })
  @ApiOkResponse({ type: [TechStackResponseDto] })
  @Get('tech-stacks')
  async listTechStacks() {
    const query = new ListTechStacksQuery();

    const techStacks = await this.queryBus.execute<
      ListTechStacksQuery,
      TechStack[]
    >(query);

    return techStacks.map((techStack) =>
      TechStackDtoAssembler.convertToDto(techStack),
    );
  }
}
