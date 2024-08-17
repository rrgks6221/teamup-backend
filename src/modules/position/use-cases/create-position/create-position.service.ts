import { Inject, Injectable } from '@nestjs/common';

import { Position } from '@module/position/entities/position.entity';
import { PositionAlreadyExistsError } from '@module/position/errors/position-already-exists.error';
import {
  POSITION_REPOSITORY,
  PositionRepositoryPort,
} from '@module/position/repositories/position.repository.port';
import {
  CreatePositionCommand,
  ICreatePositionService,
} from '@module/position/use-cases/create-position/create-position.service.interface';

@Injectable()
export class CreatePositionService implements ICreatePositionService {
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
