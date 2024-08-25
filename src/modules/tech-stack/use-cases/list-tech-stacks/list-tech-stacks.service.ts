import { Inject, Injectable } from '@nestjs/common';

import { TechStack } from '@module/tech-stack/entities/tech-stack.entity';
import {
  TECH_STACK_REPOSITORY,
  TechStackRepositoryPort,
} from '@module/tech-stack/repositories/tech-stack.repository.port';
import { IListTechStacksService } from '@module/tech-stack/use-cases/list-tech-stacks/list-tech-stacks.service.interface';

@Injectable()
export class ListTechStacksService implements IListTechStacksService {
  constructor(
    @Inject(TECH_STACK_REPOSITORY)
    private readonly techStackRepository: TechStackRepositoryPort,
  ) {}

  async execute(): Promise<TechStack[]> {
    const techStacks = await this.techStackRepository.findAll();

    return techStacks;
  }
}
