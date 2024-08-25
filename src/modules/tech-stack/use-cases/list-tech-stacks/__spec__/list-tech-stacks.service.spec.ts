import { Test, TestingModule } from '@nestjs/testing';

import { TechStackFactory } from '@module/tech-stack/entities/__spec__/tech-stack.factory';
import { TechStack } from '@module/tech-stack/entities/tech-stack.entity';
import { TechStackRepositoryModule } from '@module/tech-stack/repositories/tech-stack.repository.module';
import {
  TECH_STACK_REPOSITORY,
  TechStackRepositoryPort,
} from '@module/tech-stack/repositories/tech-stack.repository.port';
import { ListTechStacksService } from '@module/tech-stack/use-cases/list-tech-stacks/list-tech-stacks.service';
import { LIST_TECH_STACKS_SERVICE } from '@module/tech-stack/use-cases/list-tech-stacks/list-tech-stacks.service.interface';

describe(ListTechStacksService.name, () => {
  let service: ListTechStacksService;

  let techStackRepository: TechStackRepositoryPort;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TechStackRepositoryModule],
      providers: [
        {
          provide: LIST_TECH_STACKS_SERVICE,
          useClass: ListTechStacksService,
        },
      ],
    }).compile();

    service = module.get<ListTechStacksService>(LIST_TECH_STACKS_SERVICE);

    techStackRepository = module.get<TechStackRepositoryPort>(
      TECH_STACK_REPOSITORY,
    );
  });

  describe('기술스택 리스트를 조회하면', () => {
    let techStacks: TechStack[];

    beforeEach(async () => {
      techStacks = TechStackFactory.buildList(5);

      await Promise.all(
        techStacks.map((techStack) => techStackRepository.insert(techStack)),
      );
    });

    it('포지션 리스트를 조회해야한다.', async () => {
      await expect(service.execute()).resolves.toEqual(
        expect.arrayContaining(techStacks),
      );
    });
  });
});
