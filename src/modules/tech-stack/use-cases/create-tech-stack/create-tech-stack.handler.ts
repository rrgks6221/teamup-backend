import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TechStack } from '@module/tech-stack/entities/tech-stack.entity';
import { TechStackAlreadyExistsError } from '@module/tech-stack/errors/tech-stack-already-exists.error';
import {
  TECH_STACK_REPOSITORY,
  TechStackRepositoryPort,
} from '@module/tech-stack/repositories/tech-stack.repository.port';
import { CreateTechStackCommand } from '@module/tech-stack/use-cases/create-tech-stack/create-tech-stack.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(CreateTechStackCommand)
export class CreateTechStackHandler
  implements ICommandHandler<CreateTechStackCommand, TechStack>
{
  constructor(
    @Inject(TECH_STACK_REPOSITORY)
    private readonly techStackRepository: TechStackRepositoryPort,
    @Inject(EVENT_STORE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: CreateTechStackCommand): Promise<TechStack> {
    const existingTechStack = await this.techStackRepository.findOneByName(
      command.name,
    );

    if (existingTechStack !== undefined) {
      throw new TechStackAlreadyExistsError();
    }

    const newTechStack = TechStack.create({
      name: command.name,
    });

    await this.techStackRepository.insert(newTechStack);

    await this.eventStore.storeAggregateEvents(newTechStack);

    return newTechStack;
  }
}
