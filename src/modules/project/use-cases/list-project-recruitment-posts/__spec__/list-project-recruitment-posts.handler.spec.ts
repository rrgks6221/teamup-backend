import { Test, TestingModule } from '@nestjs/testing';

import { ProjectRecruitmentPostFactory } from '@module/project/entities/__spec__/project-recruitment-post.factory';
import { ProjectRecruitmentPost } from '@module/project/entities/project-recruitment-post.entity';
import { ProjectRecruitmentPostRepositoryModule } from '@module/project/repositories/project-recruitment-post.repository.module';
import {
  PROJECT_RECRUITMENT_POST_REPOSITORY,
  ProjectRecruitmentPostRepositoryPort,
} from '@module/project/repositories/project-recruitment-post.repository.port';
import { ListProjectRecruitmentPostsQueryFactory } from '@module/project/use-cases/list-project-recruitment-posts/__spec__/list-project-recruitment-posts-query.factory';
import { ListProjectRecruitmentPostsHandler } from '@module/project/use-cases/list-project-recruitment-posts/list-project-recruitment-posts.handler';
import { ListProjectRecruitmentPostsQuery } from '@module/project/use-cases/list-project-recruitment-posts/list-project-recruitment-posts.query';

import { generateEntityId } from '@common/base/base.entity';

describe(ListProjectRecruitmentPostsHandler.name, () => {
  let handler: ListProjectRecruitmentPostsHandler;

  let projectRecruitmentPostRepository: ProjectRecruitmentPostRepositoryPort;

  let query: ListProjectRecruitmentPostsQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProjectRecruitmentPostRepositoryModule],
      providers: [ListProjectRecruitmentPostsHandler],
    }).compile();

    handler = module.get<ListProjectRecruitmentPostsHandler>(
      ListProjectRecruitmentPostsHandler,
    );

    projectRecruitmentPostRepository =
      module.get<ProjectRecruitmentPostRepositoryPort>(
        PROJECT_RECRUITMENT_POST_REPOSITORY,
      );
  });

  describe('프로젝트 모집 게시글 목록이 존재하고', () => {
    let projectId: string;
    let projectRecruitmentPosts: ProjectRecruitmentPost[];
    let recruitmentPosts: ProjectRecruitmentPost[];

    beforeEach(async () => {
      projectId = generateEntityId();

      projectRecruitmentPosts = await Promise.all(
        ProjectRecruitmentPostFactory.buildList(2, {
          projectId,
        }).map((ProjectRecruitmentPost) =>
          projectRecruitmentPostRepository.insert(ProjectRecruitmentPost),
        ),
      );
      recruitmentPosts = [
        await projectRecruitmentPostRepository.insert(
          ProjectRecruitmentPostFactory.build(),
        ),
      ];
    });

    describe('프로젝트 하위 모집 게시글을 조회하면', () => {
      beforeEach(() => {
        query = ListProjectRecruitmentPostsQueryFactory.build({ projectId });
      });

      it('프로젝트 하위 모집게시글만 조회된다.', async () => {
        const result = await handler.execute(query);

        expect(result.data).toEqual(
          expect.arrayContaining(projectRecruitmentPosts),
        );
        expect(result.data).toSatisfyAll<ProjectRecruitmentPost>(
          (projectRecruitmentPost) =>
            projectRecruitmentPost.projectId === projectId,
        );
      });
    });

    describe('모든 프로젝트 하위 모집 게시글을 조회하면', () => {
      beforeEach(() => {
        query = ListProjectRecruitmentPostsQueryFactory.build({
          projectId: undefined,
        });
      });

      it('모든 프로젝트 모집 게시글이 조회된다.', async () => {
        const result = await handler.execute(query);

        expect(result.data).toEqual(
          expect.arrayContaining(projectRecruitmentPosts),
        );
        expect(result.data).toEqual(expect.arrayContaining(recruitmentPosts));
      });
    });
  });
});
