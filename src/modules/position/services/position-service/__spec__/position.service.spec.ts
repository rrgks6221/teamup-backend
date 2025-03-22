import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

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

  describe(PositionService.prototype.findByNamesOrFail.name, () => {
    let names: string[];

    beforeEach(() => {
      names = [faker.string.nanoid(), faker.string.nanoid()];
    });

    describe('포지션 식별자 목록에 해당하는 포지션이 모두 존재하는 경우', () => {
      beforeEach(async () => {
        await Promise.all(
          names.map((name) =>
            positionRepository.insert(PositionFactory.build({ name })),
          ),
        );
      });

      describe('포지션 식별자 목록로 포지션 목록을 조회하면', () => {
        it('포지션 목록이 조회된다.', async () => {
          await expect(service.findByNamesOrFail(names)).resolves.toEqual(
            expect.arrayContaining([
              expect.objectContaining({ name: names[0] }),
              expect.objectContaining({ name: names[1] }),
            ]),
          );
        });
      });
    });

    describe('포지션 식별자 목록에 해당하는 포지션이 일부만 존재하는 경우', () => {
      beforeEach(async () => {
        await positionRepository.insert(
          PositionFactory.build({ name: names[0] }),
        );
      });

      describe('포지션 식별자 목록로 포지션 목록을 조회하면', () => {
        it('포지션이 존재하지 않는다는 에러가 발생한다.', async () => {
          await expect(service.findByNamesOrFail(names)).rejects.toThrow(
            PositionNotFoundError,
          );
        });
      });
    });
  });
});
