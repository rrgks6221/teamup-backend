import { Inject, Injectable } from '@nestjs/common';

import { TechStack } from '@module/tech-stack/entities/tech-stack.entity';
import { TechStackAlreadyExistsError } from '@module/tech-stack/errors/tech-stack-already-exists.error';
import {
  TECH_STACK_REPOSITORY,
  TechStackRepositoryPort,
} from '@module/tech-stack/repositories/tech-stack.repository.port';
import {
  CreateTechStackCommand,
  ICreateTechStackService,
} from '@module/tech-stack/use-cases/create-tech-stack/create-tech-stack.service.interface';

@Injectable()
export class CreateTechStackService implements ICreateTechStackService {
  constructor(
    @Inject(TECH_STACK_REPOSITORY)
    private readonly techStackRepository: TechStackRepositoryPort,
  ) {}

  async execute(command: CreateTechStackCommand): Promise<TechStack> {
    const existingTechStack = await this.techStackRepository.findOneByName(
      command.name,
    );

    if (existingTechStack !== undefined) {
      throw new TechStackAlreadyExistsError();
    }

    const newPosition = TechStack.create({
      name: command.name,
    });

    await this.techStackRepository.insert(newPosition);

    return newPosition;
  }
}
