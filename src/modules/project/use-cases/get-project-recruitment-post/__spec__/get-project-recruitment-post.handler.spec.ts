import { Test, TestingModule } from '@nestjs/testing';

import { ProjectRecruitmentPostFactory } from '@module/project/entities/__spec__/project-recruitment-post.factory';
import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectRecruitmentPostNotFoundError } from '@module/project/errors/project-recruitment-not-found.error';
import { ProjectRecruitmentPostRepositoryModule } from '@module/project/repositories/project-recruitment-post.repository.module';
import {
  PROJECT_RECRUITMENT_POST_REPOSITORY,
  ProjectRecruitmentPostRepositoryPort,
} from '@module/project/repositories/project-recruitment-post.repository.port';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';
import { GetProjectRecruitmentPostQueryFactory } from '@module/project/use-cases/get-project-recruitment-post/__spec__/get-project-recruitment-post-query.factory';
import { GetProjectRecruitmentPostHandler } from '@module/project/use-cases/get-project-recruitment-post/get-project-recruitment-post.handler';
import { GetProjectRecruitmentPostQuery } from '@module/project/use-cases/get-project-recruitment-post/get-project-recruitment-post.query';

describe(GetProjectRecruitmentPostHandler.name, () => {
  let handler: GetProjectRecruitmentPostHandler;

  let projectRepository: ProjectRepositoryPort;
  let projectRecruitmentPostRepository: ProjectRecruitmentPostRepositoryPort;

  let query: GetProjectRecruitmentPostQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ProjectRepositoryModule,
        ProjectRecruitmentPostRepositoryModule,
      ],
      providers: [GetProjectRecruitmentPostHandler],
    }).compile();

    handler = module.get<GetProjectRecruitmentPostHandler>(
      GetProjectRecruitmentPostHandler,
    );

    projectRepository = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY);
    projectRecruitmentPostRepository =
      module.get<ProjectRecruitmentPostRepositoryPort>(
        PROJECT_RECRUITMENT_POST_REPOSITORY,
      );
  });

  beforeEach(() => {
    query = GetProjectRecruitmentPostQueryFactory.build();
  });

  describe('프로젝트 식별자와 일치하는 프로젝트가 존재하고', () => {
    beforeEach(async () => {
      await projectRepository.insert(
        ProjectFactory.build({ id: query.projectId }),
      );
    });

    describe('프로젝트 모집 게시글 식별자와 일치하는 게시글이 존재하는 경우', () => {
      beforeEach(async () => {
        await projectRecruitmentPostRepository.insert(
          ProjectRecruitmentPostFactory.build({
            id: query.projectRecruitmentPostId,
            projectId: query.projectId,
          }),
        );
      });

      describe('모집 게시글을 조회하면', () => {
        it('모집 게시글이 조회된다.', async () => {
          await expect(handler.execute(query)).resolves.toEqual(
            expect.objectContaining({
              id: query.projectRecruitmentPostId,
              projectId: query.projectId,
            }),
          );
        });
      });
    });

    describe('프로젝트 모집 게시글 식별자와 일치하는 게시글이 존재하지 않는 경우 경우', () => {
      describe('모집 게시글을 조회하면', () => {
        it('모집 게시글이 존재하지 않는다는 에러가 발생한다.', async () => {
          await expect(handler.execute(query)).rejects.toThrow(
            ProjectRecruitmentPostNotFoundError,
          );
        });
      });
    });
  });

  describe('프로젝트 식별자와 일치하는 프로젝트가 존재하지 않는 경우', () => {
    describe('모집 게시글을 조회하면', () => {
      it('프로젝트가 존재하지 않는다는 에러가 발생한다.', async () => {
        await expect(handler.execute(query)).rejects.toThrow(
          ProjectNotFoundError,
        );
      });
    });
  });
});
