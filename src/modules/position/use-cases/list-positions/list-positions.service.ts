import { Inject, Injectable } from '@nestjs/common';

import { Position } from '@module/position/entities/position.entity';
import {
  POSITION_REPOSITORY,
  PositionRepositoryPort,
} from '@module/position/repositories/position.repository.port';
import { IListPositionsService } from '@module/position/use-cases/list-positions/list-positions.service.interface';

@Injectable()
export class ListPositionsService implements IListPositionsService {
  constructor(
    @Inject(POSITION_REPOSITORY)
    private readonly positionRepository: PositionRepositoryPort,
  ) {}

  async execute(): Promise<Position[]> {
    const positions = await this.positionRepository.findAll();

    return positions;
  }
}
