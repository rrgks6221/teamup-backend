import { Test, TestingModule } from '@nestjs/testing';

import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';
import { GetProjectQueryFactory } from '@module/project/use-cases/get-project/__spec__/get-project-query.factory';
import { GetProjectHandler } from '@module/project/use-cases/get-project/get-project.handler';
import { GetProjectQuery } from '@module/project/use-cases/get-project/get-project.query';

describe(GetProjectHandler.name, () => {
  let handler: GetProjectHandler;

  let projectRepository: ProjectRepositoryPort;

  let query: GetProjectQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProjectRepositoryModule],
      providers: [GetProjectHandler],
    }).compile();

    handler = module.get<GetProjectHandler>(GetProjectHandler);

    projectRepository = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY);
  });

  beforeEach(() => {
    query = GetProjectQueryFactory.build();
  });

  describe('식별자와 일치하는 프로젝트가 존재하는 경우', () => {
    beforeEach(async () => {
      await projectRepository.insert(
        ProjectFactory.build({
          id: query.projectId,
        }),
      );
    });

    describe('프로젝트를 조회하면', () => {
      it('프로젝트가 반환돼야한다.', async () => {
        await expect(handler.execute(query)).resolves.toEqual(
          expect.objectContaining({
            id: query.projectId,
          }),
        );
      });
    });
  });

  describe('식별자와 일치하는 프로젝트가 존재하지 않는 경우', () => {
    describe('프로젝트를 조회하면', () => {
      it('프로젝트가 존재하지 않는다는 에러가 발생해야한다.', async () => {
        await expect(handler.execute(query)).rejects.toThrow(
          ProjectNotFoundError,
        );
      });
    });
  });
});
