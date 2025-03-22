import { Inject, Injectable } from '@nestjs/common';

import { Position } from '@module/position/entities/position.entity';
import { PositionNotFoundError } from '@module/position/errors/position-not-found.error';
import {
  POSITION_REPOSITORY,
  PositionRepositoryPort,
} from '@module/position/repositories/position.repository.port';
import { IPositionService } from '@module/position/services/position-service/position.service.interface';

@Injectable()
export class PositionService implements IPositionService {
  constructor(
    @Inject(POSITION_REPOSITORY)
    private readonly positionRepository: PositionRepositoryPort,
  ) {}

  async findByNamesOrFail(names: string[]): Promise<Position[]> {
    const positions = await this.positionRepository.findByNames(new Set(names));

    if (positions.length !== names.length) {
      throw new PositionNotFoundError(
        'All matching positions in the position id list do not exist',
      );
    }

    return positions;
  }
}
