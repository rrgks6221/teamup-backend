import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { PositionFactory } from '@module/position/entities/__spec__/position.factory';
import { Position } from '@module/position/entities/position.entity';
import { PositionRepository } from '@module/position/repositories/position.repository';
import {
  POSITION_REPOSITORY,
  PositionRepositoryPort,
} from '@module/position/repositories/position.repository.port';

import { generateEntityId } from '@common/base/base.entity';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

describe(PositionRepository.name, () => {
  let repository: PositionRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PRISMA_SERVICE,
          useClass: PrismaService,
        },
        {
          provide: POSITION_REPOSITORY,
          useClass: PositionRepository,
        },
      ],
    }).compile();

    repository = module.get<PositionRepositoryPort>(POSITION_REPOSITORY);
  });

  describe(PositionRepository.prototype.findOneById.name, () => {
    let positionId: string;

    beforeEach(() => {
      positionId = generateEntityId();
    });

    describe('식별자와 일치하는 리소스가 존재하는 경우', () => {
      let position: Position;

      beforeEach(async () => {
        position = await repository.insert(
          PositionFactory.build({ id: positionId }),
        );
      });

      describe('리소스를 조회하면', () => {
        it('리소스가 반환돼야한다.', async () => {
          await expect(repository.findOneById(positionId)).resolves.toEqual(
            position,
          );
        });
      });
    });
  });

  describe(PositionRepository.prototype.findOneByName.name, () => {
    describe('이름과 일치하는 포지션이 존재하고', () => {
      let position: Position;

      beforeEach(async () => {
        position = await repository.insert(PositionFactory.build());
      });

      describe('포지션을 조회하면', () => {
        it('포지션이 응답돼야한다.', async () => {
          await expect(
            repository.findOneByName(position.name),
          ).resolves.toEqual(position);
        });
      });
    });

    describe('이름과 일치하는 포지션이 존재하지 않는 경우', () => {
      describe('포지션을 조회하면', () => {
        it('undefined가 응답돼야한다.', async () => {
          await expect(
            repository.findOneByName(faker.string.nanoid()),
          ).resolves.toBeUndefined();
        });
      });
    });
  });

  describe(PositionRepository.prototype.findAll.name, () => {
    describe('포지션 전체를 조회하면', () => {
      let positions: Position[];

      beforeEach(async () => {
        positions = PositionFactory.buildList(5);

        await Promise.all(
          positions.map((position) => repository.insert(position)),
        );
      });

      it('모든 포지션을 조회해야한다.', async () => {
        await expect(repository.findAll()).resolves.toEqual(
          expect.arrayContaining(positions),
        );
      });
    });
  });
});
