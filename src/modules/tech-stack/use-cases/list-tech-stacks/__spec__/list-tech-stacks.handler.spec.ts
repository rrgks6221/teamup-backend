import { Test, TestingModule } from '@nestjs/testing';

import { TechStackFactory } from '@module/tech-stack/entities/__spec__/tech-stack.factory';
import { TechStack } from '@module/tech-stack/entities/tech-stack.entity';
import { TechStackRepositoryModule } from '@module/tech-stack/repositories/tech-stack.repository.module';
import {
  TECH_STACK_REPOSITORY,
  TechStackRepositoryPort,
} from '@module/tech-stack/repositories/tech-stack.repository.port';
import { ListTechStacksQueryFactory } from '@module/tech-stack/use-cases/list-tech-stacks/__spec__/list-tech-stacks-query.factory';
import { ListTechStacksHandler } from '@module/tech-stack/use-cases/list-tech-stacks/list-tech-stacks.handler';
import { ListTechStacksQuery } from '@module/tech-stack/use-cases/list-tech-stacks/list-tech-stacks.query';

describe(ListTechStacksHandler.name, () => {
  let handler: ListTechStacksHandler;

  let query: ListTechStacksQuery;

  let techStackRepository: TechStackRepositoryPort;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TechStackRepositoryModule],
      providers: [ListTechStacksHandler],
    }).compile();

    handler = module.get<ListTechStacksHandler>(ListTechStacksHandler);

    techStackRepository = module.get<TechStackRepositoryPort>(
      TECH_STACK_REPOSITORY,
    );
  });

  beforeEach(() => {
    query = ListTechStacksQueryFactory.build();
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
      await expect(handler.execute(query)).resolves.toEqual(
        expect.arrayContaining(techStacks),
      );
    });
  });
});
