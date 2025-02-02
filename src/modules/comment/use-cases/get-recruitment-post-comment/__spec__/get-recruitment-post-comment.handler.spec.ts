import { Test, TestingModule } from '@nestjs/testing';

import { CommentFactory } from '@module/comment/entities/__spec__/comment.factory';
import {
  Comment,
  CommentPostType,
} from '@module/comment/entities/comment.entity';
import { CommentRepositoryModule } from '@module/comment/repositories/comment.repository.module';
import {
  COMMENT_REPOSITORY,
  CommentRepositoryPort,
} from '@module/comment/repositories/comment.repository.port';
import { GetRecruitmentPostCommentQueryFactory } from '@module/comment/use-cases/get-recruitment-post-comment/__spec__/get-recruitment-post-comment-query.factory';
import { GetRecruitmentPostCommentHandler } from '@module/comment/use-cases/get-recruitment-post-comment/get-recruitment-post-comment.handler';
import { GetRecruitmentPostCommentQuery } from '@module/comment/use-cases/get-recruitment-post-comment/get-recruitment-post-comment.query';
import { ProjectRecruitmentPostFactory } from '@module/project/entities/__spec__/project-recruitment-post.factory';
import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import { ProjectRecruitmentPost } from '@module/project/entities/project-recruitment-post.entity';
import { Project } from '@module/project/entities/project.entity';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectRecruitmentPostNotFoundError } from '@module/project/errors/project-recruitment-not-found.error';
import { ProjectRecruitmentPostCommentNotFoundError } from '@module/project/errors/project-recruitment-post-comment-not-found.error';
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

describe(GetRecruitmentPostCommentHandler.name, () => {
  let handler: GetRecruitmentPostCommentHandler;

  let projectRepository: ProjectRepositoryPort;
  let projectRecruitmentPostRepository: ProjectRecruitmentPostRepositoryPort;
  let commentRepository: CommentRepositoryPort;

  let query: GetRecruitmentPostCommentQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ProjectRepositoryModule,
        ProjectRecruitmentPostRepositoryModule,
        CommentRepositoryModule,
      ],
      providers: [GetRecruitmentPostCommentHandler],
    }).compile();

    handler = module.get<GetRecruitmentPostCommentHandler>(
      GetRecruitmentPostCommentHandler,
    );

    projectRepository = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY);
    projectRecruitmentPostRepository =
      module.get<ProjectRecruitmentPostRepositoryPort>(
        PROJECT_RECRUITMENT_POST_REPOSITORY,
      );
    commentRepository = module.get<CommentRepositoryPort>(COMMENT_REPOSITORY);
  });

  beforeEach(() => {
    query = GetRecruitmentPostCommentQueryFactory.build();
  });

  describe('식별자와 일치하는 프로젝트가 존재하고', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let project: Project;

    beforeEach(async () => {
      project = await projectRepository.insert(
        ProjectFactory.build({ id: query.projectId }),
      );
    });

    describe('식별자와 일치하는 모집게시글이 존재하고', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let post: ProjectRecruitmentPost;

      beforeEach(async () => {
        post = await projectRecruitmentPostRepository.insert(
          ProjectRecruitmentPostFactory.build({
            id: query.postId,
            projectId: query.projectId,
          }),
        );
      });

      describe('식별자와 일치하는 댓글이 존재하는 경우', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let comment: Comment;

        beforeEach(async () => {
          comment = await commentRepository.insert(
            CommentFactory.build({
              id: query.commentId,
              postId: query.postId,
              postType: CommentPostType.recruitmentPost,
            }),
          );
        });

        describe('모집 게시글 댓글을 조회하면', () => {
          it('모집 게시글 댓글이 반환돼야한다.', async () => {
            await expect(handler.execute(query)).resolves.toEqual(
              expect.objectContaining({
                id: query.commentId,
                postId: query.postId,
                postType: CommentPostType.recruitmentPost,
              }),
            );
          });
        });
      });

      describe('식별자와 일치하는 모집 게시글 댓글이 존재하지 않는 경우', () => {
        describe('모집 게시글 댓글을 조회하면', () => {
          it('모집 게시글 댓글이 존재하지 않는다는 에러가 발생해야한다.', async () => {
            await expect(handler.execute(query)).rejects.toThrow(
              ProjectRecruitmentPostCommentNotFoundError,
            );
          });
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
