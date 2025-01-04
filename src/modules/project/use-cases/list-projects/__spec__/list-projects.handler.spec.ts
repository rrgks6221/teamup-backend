import { Test, TestingModule } from '@nestjs/testing';

import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import { Project } from '@module/project/entities/project.entity';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';
import { ListProjectsQueryFactory } from '@module/project/use-cases/list-projects/__spec__/list-projects-query.factory';
import { ListProjectsHandler } from '@module/project/use-cases/list-projects/list-projects.handler';
import { ListProjectsQuery } from '@module/project/use-cases/list-projects/list-projects.query';

describe(ListProjectsHandler.name, () => {
  let handler: ListProjectsHandler;

  let projectRepository: ProjectRepositoryPort;

  let query: ListProjectsQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProjectRepositoryModule],
      providers: [ListProjectsHandler],
    }).compile();

    handler = module.get<ListProjectsHandler>(ListProjectsHandler);

    projectRepository = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY);
  });

  beforeEach(() => {
    query = ListProjectsQueryFactory.build();
  });

  describe('프로젝트 목록을 조회하면', () => {
    let projects: Project[];

    beforeEach(async () => {
      projects = await Promise.all(
        ProjectFactory.buildList(2).map((project) =>
          projectRepository.insert(project),
        ),
      );
    });

    it('프로젝트 목록이 조회된다.', async () => {
      const result = await handler.execute(query);

      expect(result.data).toEqual(expect.arrayContaining(projects));
    });
  });
});
