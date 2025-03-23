import { Test, TestingModule } from '@nestjs/testing';

import { TechStackFactory } from '@module/tech-stack/entities/__spec__/tech-stack.factory';
import { TechStackNotFoundError } from '@module/tech-stack/errors/tech-stack-not-found.error';
import { TechStackRepositoryModule } from '@module/tech-stack/repositories/tech-stack.repository.module';
import {
  TECH_STACK_REPOSITORY,
  TechStackRepositoryPort,
} from '@module/tech-stack/repositories/tech-stack.repository.port';
import { TechStackService } from '@module/tech-stack/services/tech-stack-service/tech-stack.service';
import {
  ITechStackService,
  TECH_STACK_SERVICE,
} from '@module/tech-stack/services/tech-stack-service/tech-stack.service.interface';

import { generateEntityId } from '@common/base/base.entity';

describe(TechStackService.name, () => {
  let service: ITechStackService;

  let techStackRepository: TechStackRepositoryPort;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TechStackRepositoryModule],
      providers: [
        {
          provide: TECH_STACK_SERVICE,
          useClass: TechStackService,
        },
      ],
    }).compile();

    service = module.get<ITechStackService>(TECH_STACK_SERVICE);

    techStackRepository = module.get<TechStackRepositoryPort>(
      TECH_STACK_REPOSITORY,
    );
  });

  describe(TechStackService.prototype.findByNamesOrFail.name, () => {
    let names: string[];

    beforeEach(() => {
      names = [generateEntityId(), generateEntityId()];
    });

    describe('기술 스택 식별자 목록에 해당하는 기술 스택이 모두 존재하는 경우', () => {
      beforeEach(async () => {
        await Promise.all(
          names.map((name) =>
            techStackRepository.insert(TechStackFactory.build({ name })),
          ),
        );
      });

      describe('기술 스택 식별자 목록로 기술 스택 목록을 조회하면', () => {
        it('기술 스택 목록이 조회된다.', async () => {
          await expect(service.findByNamesOrFail(names)).resolves.toEqual(
            expect.arrayContaining([
              expect.objectContaining({ name: names[0] }),
              expect.objectContaining({ name: names[1] }),
            ]),
          );
        });
      });
    });

    describe('기술 스택 식별자 목록에 해당하는 기술 스택이 일부만 존재하는 경우', () => {
      beforeEach(async () => {
        await techStackRepository.insert(
          TechStackFactory.build({ name: names[0] }),
        );
      });

      describe('기술 스택 식별자 목록로 기술 스택 목록을 조회하면', () => {
        it('기술 스택이 존재하지 않는다는 에러가 발생한다.', async () => {
          await expect(service.findByNamesOrFail(names)).rejects.toThrow(
            TechStackNotFoundError,
          );
        });
      });
    });
  });
});
