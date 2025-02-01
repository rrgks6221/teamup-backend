import { Test, TestingModule } from '@nestjs/testing';

import { CommentFactory } from '@module/comment/entities/__spec__/comment.factory';
import { Comment } from '@module/comment/entities/comment.entity';
import { CommentRepositoryModule } from '@module/comment/repositories/comment.repository.module';
import {
  COMMENT_REPOSITORY,
  CommentRepositoryPort,
} from '@module/comment/repositories/comment.repository.port';
import { ListRecruitmentPostCommentsQueryFactory } from '@module/comment/use-cases/list-recruitment-post-comments/__spec__/list-recruitment-post-comments-query.factory';
import { ListRecruitmentPostCommentsHandler } from '@module/comment/use-cases/list-recruitment-post-comments/list-recruitment-post-comments.handler';
import { ListRecruitmentPostCommentsQuery } from '@module/comment/use-cases/list-recruitment-post-comments/list-recruitment-post-comments.query';
import { ProjectRecruitmentPostFactory } from '@module/project/entities/__spec__/project-recruitment-post.factory';
import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import { ProjectRecruitmentPost } from '@module/project/entities/project-recruitment-post.entity';
import { Project } from '@module/project/entities/project.entity';
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

describe(ListRecruitmentPostCommentsHandler.name, () => {
  let handler: ListRecruitmentPostCommentsHandler;

  let projectRepository: ProjectRepositoryPort;
  let projectRecruitmentPostRepository: ProjectRecruitmentPostRepositoryPort;
  let commentRepository: CommentRepositoryPort;

  let query: ListRecruitmentPostCommentsQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ProjectRepositoryModule,
        ProjectRecruitmentPostRepositoryModule,
        CommentRepositoryModule,
      ],
      providers: [ListRecruitmentPostCommentsHandler],
    }).compile();

    handler = module.get<ListRecruitmentPostCommentsHandler>(
      ListRecruitmentPostCommentsHandler,
    );

    projectRepository = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY);
    projectRecruitmentPostRepository =
      module.get<ProjectRecruitmentPostRepositoryPort>(
        PROJECT_RECRUITMENT_POST_REPOSITORY,
      );
    commentRepository = module.get<CommentRepositoryPort>(COMMENT_REPOSITORY);
  });

  beforeEach(() => {
    query = ListRecruitmentPostCommentsQueryFactory.build();
  });

  describe('식별자와 일치하는 프로젝트가 존재하고', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let project: Project;

    beforeEach(async () => {
      project = await projectRepository.insert(
        ProjectFactory.build({ id: query.projectId }),
      );
    });

    describe('식별자와 일치하는 모집게시글이 존재하는 경우', () => {
      let post: ProjectRecruitmentPost;

      beforeEach(async () => {
        post = await projectRecruitmentPostRepository.insert(
          ProjectRecruitmentPostFactory.build({
            id: query.postId,
            projectId: query.projectId,
          }),
        );
      });

      describe('댓글 목록을 조회하면', () => {
        let comments: Comment[];

        beforeEach(async () => {
          comments = await Promise.all(
            CommentFactory.buildList(2, {
              postId: query.postId,
              postType: query.postType,
            }).map((comment) => commentRepository.insert(comment)),
          );
        });

        it('댓글 목록이 조회된다.', async () => {
          const result = await handler.execute(query);

          expect(result.data).toEqual(expect.arrayContaining(comments));
          expect(result.data).toSatisfyAll<Comment>(
            (comment) =>
              comment.postType === query.postType && comment.postId === post.id,
          );
        });
      });
    });

    describe('식별자와 일치하는 모집 게시글이 존재하지 않는 경우', () => {
      describe('댓글 목록을 조회하면', () => {
        it('모집 게시글이 존재하지 않는다는 에러가 발생해야한다.', async () => {
          await expect(handler.execute(query)).rejects.toThrow(
            ProjectRecruitmentPostNotFoundError,
          );
        });
      });
    });
  });

  describe('식별자와 일치하는 프로젝트가 존재하지 않는 경우', () => {
    describe('댓글 목록을 조회하면', () => {
      it('프로젝트가 존재하지 않는다는 에러가 발생해야한다.', async () => {
        await expect(handler.execute(query)).rejects.toThrow(
          ProjectNotFoundError,
        );
      });
    });
  });
});
