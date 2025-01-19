import { Test, TestingModule } from '@nestjs/testing';

import { ProjectRecruitmentPostFactory } from '@module/project/entities/__spec__/project-recruitment-post.factory';
import { ProjectRecruitmentPost } from '@module/project/entities/project-recruitment-post.entity';
import { ProjectRecruitmentPostRepository } from '@module/project/repositories/project-recruitment-post.repository';
import {
  PROJECT_RECRUITMENT_POST_REPOSITORY,
  ProjectRecruitmentPostRepositoryPort,
} from '@module/project/repositories/project-recruitment-post.repository.port';

import { generateEntityId } from '@common/base/base.entity';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

describe(ProjectRecruitmentPostRepository.name, () => {
  let repository: ProjectRecruitmentPostRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PRISMA_SERVICE,
          useClass: PrismaService,
        },
        {
          provide: PROJECT_RECRUITMENT_POST_REPOSITORY,
          useClass: ProjectRecruitmentPostRepository,
        },
      ],
    }).compile();

    repository = module.get<ProjectRecruitmentPostRepositoryPort>(
      PROJECT_RECRUITMENT_POST_REPOSITORY,
    );
  });

  describe(ProjectRecruitmentPostRepository.prototype.findOneById.name, () => {
    let projectRecruitmentPostId: string;

    beforeEach(() => {
      projectRecruitmentPostId = generateEntityId();
    });

    describe('식별자와 일치하는 리소스가 존재하는 경우', () => {
      let projectRecruitmentPost: ProjectRecruitmentPost;

      beforeEach(async () => {
        projectRecruitmentPost = await repository.insert(
          ProjectRecruitmentPostFactory.build({ id: projectRecruitmentPostId }),
        );
      });

      describe('리소스를 조회하면', () => {
        it('리소스가 반환돼야한다.', async () => {
          await expect(
            repository.findOneById(projectRecruitmentPostId),
          ).resolves.toEqual(projectRecruitmentPost);
        });
      });
    });
  });

  describe(
    ProjectRecruitmentPostRepository.prototype.findAllCursorPaginated.name,
    () => {
      let projectId: string;
      let projectRecruitmentPosts: ProjectRecruitmentPost[];

      beforeAll(async () => {
        projectId = generateEntityId();

        projectRecruitmentPosts = await Promise.all(
          [
            ProjectRecruitmentPostFactory.build(),
            ProjectRecruitmentPostFactory.build({ projectId }),
            ProjectRecruitmentPostFactory.build({ projectId }),
          ].map((project) => repository.insert(project)),
        );
      });

      describe('프로젝트 식별자로 필터링 하는 경우', () => {
        it('프로젝트 식별자와 일치하는 프로젝트 모집 게시글만 반환해야한다.', async () => {
          const result = await repository.findAllCursorPaginated({
            filter: {
              projectId,
            },
          });

          expect(result.data.length).toBeGreaterThanOrEqual(2);
          expect(result.data).toSatisfyAll<ProjectRecruitmentPost>(
            (projectRecruitmentPost) =>
              projectRecruitmentPost.projectId === projectId,
          );
        });
      });

      describe('정렬 옵션이 존재하지 않는 경우', () => {
        it('기본 정렬인 id로 정렬된 프로젝트 모집 게시글 목록이 반환돼야한다.', async () => {
          const result = await repository.findAllCursorPaginated({});

          expect(result.data.length).toBeGreaterThanOrEqual(1);
          expect(result.data).toEqual(
            [...result.data].sort((a, b) => {
              if (a.id > b.id) {
                return 1;
              }
              if (a.id < b.id) {
                return -1;
              }
              return 0;
            }),
          );
        });
      });

      describe('커서가 존재하는 경우', () => {
        it('커서 이후의 프로젝트 모집 게시글 목록만 반환해야한다.', async () => {
          const cursor = projectRecruitmentPosts[0].id;
          const result = await repository.findAllCursorPaginated({
            cursor,
          });

          expect(result.data.length).toBeGreaterThanOrEqual(1);
          expect(result.data).toSatisfyAll<ProjectRecruitmentPost>(
            (el) => el.id > cursor,
          );
        });
      });

      describe('다음 커서가 존재하지 않는 경우', () => {
        it('프로젝트 모집 게시글 목록만 반환해야한다.', async () => {
          const result = await repository.findAllCursorPaginated({
            limit: 10000,
          });

          expect(result.cursor).toBeUndefined();
          expect(result.data.length).toBeGreaterThanOrEqual(1);
          expect(result.data).toBeArray();
        });
      });

      describe('다음 커서가 존재하는 경우', () => {
        it('커서를 포함한 프로젝트 모집 게시글 목록을 반환해야한다.', async () => {
          const result = await repository.findAllCursorPaginated({
            limit: 1,
          });

          expect(result.cursor).toBeDefined();
          expect(result.data.length).toBeGreaterThanOrEqual(1);
          expect(result.data).toBeArrayOfSize(1);
        });
      });
    },
  );
});
