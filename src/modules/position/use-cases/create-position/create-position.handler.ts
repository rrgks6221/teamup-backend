import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Position } from '@module/position/entities/position.entity';
import { PositionAlreadyExistsError } from '@module/position/errors/position-already-exists.error';
import {
  POSITION_REPOSITORY,
  PositionRepositoryPort,
} from '@module/position/repositories/position.repository.port';
import { CreatePositionCommand } from '@module/position/use-cases/create-position/create-position.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(CreatePositionCommand)
export class CreatePositionHandler
  implements ICommandHandler<CreatePositionCommand, Position>
{
  constructor(
    @Inject(POSITION_REPOSITORY)
    private readonly positionRepository: PositionRepositoryPort,
    @Inject(EVENT_STORE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: CreatePositionCommand): Promise<Position> {
    const existingPosition = await this.positionRepository.findOneByName(
      command.name,
    );

    if (existingPosition !== undefined) {
      throw new PositionAlreadyExistsError();
    }

    const newPosition = Position.create({
      name: command.name,
    });

    await this.positionRepository.insert(newPosition);

    await this.eventStore.storeAggregateEvents(newPosition);

    return newPosition;
  }
}
