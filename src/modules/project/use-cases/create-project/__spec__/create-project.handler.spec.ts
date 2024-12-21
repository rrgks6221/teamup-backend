import { Test, TestingModule } from '@nestjs/testing';

import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { CreateProjectCommandFactory } from '@module/project/use-cases/create-project/__spec__/create-project-command.factory';
import { CreateProjectCommand } from '@module/project/use-cases/create-project/create-project.command';
import { CreateProjectHandler } from '@module/project/use-cases/create-project/create-project.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(CreateProjectHandler.name, () => {
  let handler: CreateProjectHandler;

  let command: CreateProjectCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProjectRepositoryModule, EventStoreModule],
      providers: [CreateProjectHandler],
    }).compile();

    handler = module.get<CreateProjectHandler>(CreateProjectHandler);
  });

  beforeEach(async () => {
    command = CreateProjectCommandFactory.build({});
  });

  describe('프로젝트를 생성하면', () => {
    it('프로젝트가 생성돼야한다.', async () => {
      await expect(handler.execute(command)).resolves.toEqual(
        expect.objectContaining({
          ownerId: command.ownerId,
          name: command.name,
          description: command.description,
          category: command.category,
          tags: command.tags,
        }),
      );
    });
  });
});
