import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { TechStack } from '@module/tech-stack/entities/tech-stack.entity';
import {
  TECH_STACK_REPOSITORY,
  TechStackRepositoryPort,
} from '@module/tech-stack/repositories/tech-stack.repository.port';
import { ListTechStacksQuery } from '@module/tech-stack/use-cases/list-tech-stacks/list-tech-stacks.query';

@QueryHandler(ListTechStacksQuery)
export class ListTechStacksHandler
  implements IQueryHandler<ListTechStacksQuery, TechStack[]>
{
  constructor(
    @Inject(TECH_STACK_REPOSITORY)
    private readonly techStackRepository: TechStackRepositoryPort,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(query: ListTechStacksQuery): Promise<TechStack[]> {
    const techStacks = await this.techStackRepository.findAll();

    return techStacks;
  }
}
