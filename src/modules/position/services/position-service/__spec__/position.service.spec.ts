import { Test, TestingModule } from '@nestjs/testing';

import { PositionFactory } from '@module/position/entities/__spec__/position.factory';
import { PositionNotFoundError } from '@module/position/errors/position-not-found.error';
import { PositionRepositoryModule } from '@module/position/repositories/position.repository.module';
import {
  POSITION_REPOSITORY,
  PositionRepositoryPort,
} from '@module/position/repositories/position.repository.port';
import { PositionService } from '@module/position/services/position-service/position.service';
import {
  IPositionService,
  POSITION_SERVICE,
} from '@module/position/services/position-service/position.service.interface';

import { generateEntityId } from '@common/base/base.entity';

describe(PositionService.name, () => {
  let service: IPositionService;

  let positionRepository: PositionRepositoryPort;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PositionRepositoryModule],
      providers: [
        {
          provide: POSITION_SERVICE,
          useClass: PositionService,
        },
      ],
    }).compile();

    service = module.get<IPositionService>(POSITION_SERVICE);

    positionRepository =
      module.get<PositionRepositoryPort>(POSITION_REPOSITORY);
  });

  describe(PositionService.prototype.findByIdsOrFail.name, () => {
    let ids: string[];

    beforeEach(() => {
      ids = [generateEntityId(), generateEntityId()];
    });

    describe('포지션 식별자 목록에 해당하는 포지션이 모두 존재하는 경우', () => {
      beforeEach(async () => {
        await Promise.all(
          ids.map((id) =>
            positionRepository.insert(PositionFactory.build({ id })),
          ),
        );
      });

      describe('포지션 식별자 목록로 포지션 목록을 조회하면', () => {
        it('포지션 목록이 조회된다.', async () => {
          await expect(service.findByIdsOrFail(ids)).resolves.toEqual(
            expect.arrayContaining([
              expect.objectContaining({ id: ids[0] }),
              expect.objectContaining({ id: ids[1] }),
            ]),
          );
        });
      });
    });

    describe('포지션 식별자 목록에 해당하는 포지션이 일부만 존재하는 경우', () => {
      beforeEach(async () => {
        await positionRepository.insert(PositionFactory.build({ id: ids[0] }));
      });

      describe('포지션 식별자 목록로 포지션 목록을 조회하면', () => {
        it('포지션이 존재하지 않는다는 에러가 발생한다.', async () => {
          await expect(service.findByIdsOrFail(ids)).rejects.toThrow(
            PositionNotFoundError,
          );
        });
      });
    });
  });
});
