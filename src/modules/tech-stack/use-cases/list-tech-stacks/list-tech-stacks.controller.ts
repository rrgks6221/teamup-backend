import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { TechStackDtoAssembler } from '@module/tech-stack/assemblers/tech-stack-dto.assembler';
import { TechStackResponseDto } from '@module/tech-stack/dto/tech-stack.response-dto';
import {
  IListTechStacksService,
  LIST_TECH_STACKS_SERVICE,
} from '@module/tech-stack/use-cases/list-tech-stacks/list-tech-stacks.service.interface';

@ApiTags('tech-stack')
@Controller()
export class ListTechStacksController {
  constructor(
    @Inject(LIST_TECH_STACKS_SERVICE)
    private readonly listTechStacksService: IListTechStacksService,
  ) {}

  @ApiOperation({ summary: '기술스택 리스트 조회' })
  @ApiOkResponse({ type: [TechStackResponseDto] })
  @Get('tech-stacks')
  async listTechStacks() {
    const techStacks = await this.listTechStacksService.execute();

    return techStacks.map((techStack) =>
      TechStackDtoAssembler.convertToDto(techStack),
    );
  }
}
