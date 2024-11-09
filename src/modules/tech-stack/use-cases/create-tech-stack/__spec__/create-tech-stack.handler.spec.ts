import { Test, TestingModule } from '@nestjs/testing';

import { TechStackFactory } from '@module/tech-stack/entities/__spec__/tech-stack.factory';
import { TechStackAlreadyExistsError } from '@module/tech-stack/errors/tech-stack-already-exists.error';
import { TechStackRepositoryModule } from '@module/tech-stack/repositories/tech-stack.repository.module';
import {
  TECH_STACK_REPOSITORY,
  TechStackRepositoryPort,
} from '@module/tech-stack/repositories/tech-stack.repository.port';
import { CreateTechStackCommandFactory } from '@module/tech-stack/use-cases/create-tech-stack/__spec__/create-tech-stack-command.factory';
import { CreateTechStackCommand } from '@module/tech-stack/use-cases/create-tech-stack/create-tech-stack.command';
import { CreateTechStackHandler } from '@module/tech-stack/use-cases/create-tech-stack/create-tech-stack.handler';

describe(CreateTechStackHandler.name, () => {
  let handler: CreateTechStackHandler;

  let techStackRepository: TechStackRepositoryPort;

  let command: CreateTechStackCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TechStackRepositoryModule],
      providers: [CreateTechStackHandler],
    }).compile();

    handler = module.get<CreateTechStackHandler>(CreateTechStackHandler);

    techStackRepository = module.get<TechStackRepositoryPort>(
      TECH_STACK_REPOSITORY,
    );
  });

  beforeEach(() => {
    command = CreateTechStackCommandFactory.build();
  });

  describe('이름이 동일한 기술스택이 존재하지 않고', () => {
    describe('기술스택을 생성하면', () => {
      it('기술스택이 생성된다.', async () => {
        await expect(handler.execute(command)).resolves.toEqual(
          expect.objectContaining({
            name: command.name,
          }),
        );
      });
    });
  });

  describe('이름이 동일한 기술스택이 존재하는 경우', () => {
    beforeEach(async () => {
      await techStackRepository.insert(
        TechStackFactory.build({ name: command.name }),
      );
    });

    describe('기술스택을 생성하면', () => {
      it('이미 기술스택이 존재한다는 에러가 발생한다.', async () => {
        await expect(handler.execute(command)).rejects.toThrow(
          TechStackAlreadyExistsError,
        );
      });
    });
  });
});
