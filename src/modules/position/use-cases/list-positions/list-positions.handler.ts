import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Position } from '@module/position/entities/position.entity';
import {
  POSITION_REPOSITORY,
  PositionRepositoryPort,
} from '@module/position/repositories/position.repository.port';
import { ListPositionsQuery } from '@module/position/use-cases/list-positions/list-positions.query';

@QueryHandler(ListPositionsQuery)
export class ListPositionsHandler
  implements IQueryHandler<ListPositionsQuery, Position[]>
{
  constructor(
    @Inject(POSITION_REPOSITORY)
    private readonly positionRepository: PositionRepositoryPort,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(query: ListPositionsQuery): Promise<Position[]> {
    const positions = await this.positionRepository.findAll();

    return positions;
  }
}
