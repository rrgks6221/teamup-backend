import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Position } from '@module/position/entities/position.entity';
import { PositionAlreadyExistsError } from '@module/position/errors/position-already-exists.error';
import {
  POSITION_REPOSITORY,
  PositionRepositoryPort,
} from '@module/position/repositories/position.repository.port';
import { CreatePositionCommand } from '@module/position/use-cases/create-position/create-position.command';

@CommandHandler(CreatePositionCommand)
export class CreatePositionHandler
  implements ICommandHandler<CreatePositionCommand, Position>
{
  constructor(
    @Inject(POSITION_REPOSITORY)
    private readonly positionRepository: PositionRepositoryPort,
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

    return newPosition;
  }
}
