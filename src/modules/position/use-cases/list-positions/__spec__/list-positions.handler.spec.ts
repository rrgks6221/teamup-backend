import { Test, TestingModule } from '@nestjs/testing';

import { PositionFactory } from '@module/position/entities/__spec__/position.factory';
import { Position } from '@module/position/entities/position.entity';
import { PositionRepositoryModule } from '@module/position/repositories/position.repository.module';
import {
  POSITION_REPOSITORY,
  PositionRepositoryPort,
} from '@module/position/repositories/position.repository.port';
import { ListPositionsQueryFactory } from '@module/position/use-cases/list-positions/__spec__/list-tech-stacks-query.factory';
import { ListPositionsHandler } from '@module/position/use-cases/list-positions/list-positions.handler';
import { ListPositionsQuery } from '@module/position/use-cases/list-positions/list-positions.query';

describe(ListPositionsHandler.name, () => {
  let handler: ListPositionsHandler;

  let query: ListPositionsQuery;

  let positionRepository: PositionRepositoryPort;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PositionRepositoryModule],
      providers: [ListPositionsHandler],
    }).compile();

    handler = module.get<ListPositionsHandler>(ListPositionsHandler);

    positionRepository =
      module.get<PositionRepositoryPort>(POSITION_REPOSITORY);
  });

  beforeEach(() => {
    query = ListPositionsQueryFactory.build();
  });

  describe('포지션 리스트를 조회하면', () => {
    let positions: Position[];

    beforeEach(async () => {
      positions = PositionFactory.buildList(5);

      await Promise.all(
        positions.map((position) => positionRepository.insert(position)),
      );
    });

    it('포지션 리스트를 조회해야한다.', async () => {
      await expect(handler.execute(query)).resolves.toEqual(
        expect.arrayContaining(positions),
      );
    });
  });
});
