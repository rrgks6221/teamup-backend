import { Test, TestingModule } from '@nestjs/testing';

import { PositionFactory } from '@module/position/entities/__spec__/position.factory';
import { Position } from '@module/position/entities/position.entity';
import { PositionRepositoryModule } from '@module/position/repositories/position.repository.module';
import {
  POSITION_REPOSITORY,
  PositionRepositoryPort,
} from '@module/position/repositories/position.repository.port';
import { ListPositionsService } from '@module/position/use-cases/list-positions/list-positions.service';
import { LIST_POSITIONS_SERVICE } from '@module/position/use-cases/list-positions/list-positions.service.interface';

describe('ListPositionsService', () => {
  let service: ListPositionsService;

  let positionRepository: PositionRepositoryPort;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PositionRepositoryModule],
      providers: [
        {
          provide: LIST_POSITIONS_SERVICE,
          useClass: ListPositionsService,
        },
      ],
    }).compile();

    service = module.get<ListPositionsService>(LIST_POSITIONS_SERVICE);

    positionRepository =
      module.get<PositionRepositoryPort>(POSITION_REPOSITORY);
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
      await expect(service.execute()).resolves.toEqual(
        expect.arrayContaining(positions),
      );
    });
  });
});
