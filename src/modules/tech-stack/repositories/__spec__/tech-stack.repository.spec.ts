import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { TechStackFactory } from '@module/tech-stack/entities/__spec__/tech-stack.factory';
import { TechStack } from '@module/tech-stack/entities/tech-stack.entity';
import { TechStackRepository } from '@module/tech-stack/repositories/tech-stack.repository';
import {
  TECH_STACK_REPOSITORY,
  TechStackRepositoryPort,
} from '@module/tech-stack/repositories/tech-stack.repository.port';

import { generateEntityId } from '@common/base/base.entity';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

describe(TechStackRepository.name, () => {
  let repository: TechStackRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PRISMA_SERVICE,
          useClass: PrismaService,
        },
        {
          provide: TECH_STACK_REPOSITORY,
          useClass: TechStackRepository,
        },
      ],
    }).compile();

    repository = module.get<TechStackRepositoryPort>(TECH_STACK_REPOSITORY);
  });

  describe(TechStackRepository.prototype.findOneById.name, () => {
    let techStackId: string;

    beforeEach(() => {
      techStackId = generateEntityId();
    });

    describe('식별자와 일치하는 리소스가 존재하는 경우', () => {
      let techStack: TechStack;

      beforeEach(async () => {
        techStack = await repository.insert(
          TechStackFactory.build({ id: techStackId }),
        );
      });

      describe('리소스를 조회하면', () => {
        it('리소스가 반환돼야한다.', async () => {
          await expect(repository.findOneById(techStackId)).resolves.toEqual(
            techStack,
          );
        });
      });
    });
  });

  describe(TechStackRepository.prototype.findOneByName.name, () => {
    describe('이름과 일치하는 기술 스택이 존재하고', () => {
      let techStack: TechStack;

      beforeEach(async () => {
        techStack = await repository.insert(TechStackFactory.build());
      });

      describe('기술 스택을 조회하면', () => {
        it('기술 스택이 응답돼야한다.', async () => {
          await expect(
            repository.findOneByName(techStack.name),
          ).resolves.toEqual(techStack);
        });
      });
    });

    describe('이름과 일치하는 기술 스택이 존재하지 않는 경우', () => {
      describe('기술 스택을 조회하면', () => {
        it('undefined가 응답돼야한다.', async () => {
          await expect(
            repository.findOneByName(faker.string.nanoid()),
          ).resolves.toBeUndefined();
        });
      });
    });
  });

  describe(TechStackRepository.prototype.findByIds.name, () => {
    let techStackIds: string[];

    beforeEach(() => {
      techStackIds = [generateEntityId(), generateEntityId()];
    });

    describe('기술 스택 식별자리스트와 일치하는 기술 스택이 존재하는 경우', () => {
      beforeEach(async () => {
        await Promise.all([
          repository.insert(TechStackFactory.build()),
          ...techStackIds.map((id) =>
            repository.insert(TechStackFactory.build({ id })),
          ),
        ]);
      });

      describe('기술 스택을 조회하면', () => {
        it('식별자와 일치하는 기술 스택 리스트가 조회된다.', async () => {
          await expect(repository.findByIds(techStackIds)).resolves.toEqual(
            expect.arrayContaining([
              expect.objectContaining({ id: techStackIds[0] }),
              expect.objectContaining({ id: techStackIds[1] }),
            ]),
          );
        });
      });
    });
  });

  describe(TechStackRepository.prototype.findAll.name, () => {
    describe('기술스택 전체를 조회하면', () => {
      let techStacks: TechStack[];

      beforeEach(async () => {
        techStacks = TechStackFactory.buildList(5);

        await Promise.all(
          techStacks.map((techStack) => repository.insert(techStack)),
        );
      });

      it('모든 기술스택을 조회해야한다.', async () => {
        await expect(repository.findAll()).resolves.toEqual(
          expect.arrayContaining(techStacks),
        );
      });
    });
  });
});
