import { Test, TestingModule } from '@nestjs/testing';

import { ProjectMemberFactory } from '@module/project/entities/__spec__/project-member.factory';
import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import { ProjectMemberNotFoundError } from '@module/project/errors/project-member-not-found.error copy';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectMemberRepositoryModule } from '@module/project/repositories/project-member.repository.module';
import {
  PROJECT_MEMBER_REPOSITORY,
  ProjectMemberRepositoryPort,
} from '@module/project/repositories/project-member.repository.port';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';
import { GetProjectMemberQueryFactory } from '@module/project/use-cases/get-project-member/__spec__/get-project-member-query.factory';
import { GetProjectMemberHandler } from '@module/project/use-cases/get-project-member/get-project-member.handler';
import { GetProjectMemberQuery } from '@module/project/use-cases/get-project-member/get-project-member.query';

describe(GetProjectMemberHandler.name, () => {
  let handler: GetProjectMemberHandler;

  let projectRepository: ProjectRepositoryPort;
  let projectMemberRepository: ProjectMemberRepositoryPort;

  let query: GetProjectMemberQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProjectRepositoryModule, ProjectMemberRepositoryModule],
      providers: [GetProjectMemberHandler],
    }).compile();

    handler = module.get<GetProjectMemberHandler>(GetProjectMemberHandler);

    projectRepository = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY);
    projectMemberRepository = module.get<ProjectMemberRepositoryPort>(
      PROJECT_MEMBER_REPOSITORY,
    );
  });

  beforeEach(() => {
    query = GetProjectMemberQueryFactory.build();
  });

  describe('프로젝트 식별자와 일치하는 프로젝트가 존재하고', () => {
    beforeEach(async () => {
      await projectRepository.insert(
        ProjectFactory.build({ id: query.projectId }),
      );
    });

    describe('구성원 식별자와 일치하는 구성원이 존재하는 경우', () => {
      beforeEach(async () => {
        await projectMemberRepository.insert(
          ProjectMemberFactory.build({
            id: query.memberId,
            projectId: query.projectId,
          }),
        );
      });

      describe('구성원을 조회하면', () => {
        it('구성원이 조회돼야한다.', async () => {
          await expect(handler.execute(query)).resolves.toEqual(
            expect.objectContaining({
              id: query.memberId,
              projectId: query.projectId,
            }),
          );
        });
      });
    });

    describe('구성원 식별자와 일치하는 구성원이 존재하지 않는 경우', () => {
      describe('구성원을 조회하면', () => {
        it('구성원이 존재하지 않는다는 에러가 발생해야한다.', async () => {
          await expect(handler.execute(query)).rejects.toThrow(
            ProjectMemberNotFoundError,
          );
        });
      });
    });
  });

  describe('프로젝트 식별자와 일치하는 프로젝트가 존재하지 않는 경우', () => {
    describe('구성원을 조회하면', () => {
      it('프로젝트가 존재하지 않는다는 에러가 발생해야한다.', async () => {
        await expect(handler.execute(query)).rejects.toThrow(
          ProjectNotFoundError,
        );
      });
    });
  });
});
