import { Inject, Injectable } from '@nestjs/common';

import { TechStack } from '@module/tech-stack/entities/tech-stack.entity';
import { TechStackNotFoundError } from '@module/tech-stack/errors/tech-stack-not-found.error';
import {
  TECH_STACK_REPOSITORY,
  TechStackRepositoryPort,
} from '@module/tech-stack/repositories/tech-stack.repository.port';
import { ITechStackService } from '@module/tech-stack/services/tech-stack-service/tech-stack.service.interface';

@Injectable()
export class TechStackService implements ITechStackService {
  constructor(
    @Inject(TECH_STACK_REPOSITORY)
    private readonly techStackRepository: TechStackRepositoryPort,
  ) {}

  async findByIdsOrFail(ids: string[]): Promise<TechStack[]> {
    const techStacks = await this.techStackRepository.findByIds(new Set(ids));

    if (techStacks.length !== ids.length) {
      throw new TechStackNotFoundError(
        'All matching tech stacks in the tech stack id list do not exist',
      );
    }

    return techStacks;
  }
}
