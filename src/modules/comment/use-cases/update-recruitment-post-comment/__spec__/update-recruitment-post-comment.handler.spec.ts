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
import { UpdateRecruitmentPostCommentCommandFactory } from '@module/comment/use-cases/update-recruitment-post-comment/__spec__/update-recruitment-post-comment-command.factory';
import { UpdateRecruitmentPostCommentCommand } from '@module/comment/use-cases/update-recruitment-post-comment/update-recruitment-post-comment.command';
import { UpdateRecruitmentPostCommentHandler } from '@module/comment/use-cases/update-recruitment-post-comment/update-recruitment-post-comment.handler';
import { ProjectRecruitmentPostFactory } from '@module/project/entities/__spec__/project-recruitment-post.factory';
import { ProjectFactory } from '@module/project/entities/__spec__/project.factory';
import { ProjectRecruitmentPost } from '@module/project/entities/project-recruitment-post.entity';
import { Project } from '@module/project/entities/project.entity';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectRecruitmentPostNotFoundError } from '@module/project/errors/project-recruitment-not-found.error';
import { ProjectRecruitmentPostCommentNotFoundError } from '@module/project/errors/project-recruitment-post-comment-not-found.error';
import { ProjectRecruitmentPostCommentUpdateRestrictedError } from '@module/project/errors/project-recruitment-post-comment-update-restricted.error';
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

import { generateEntityId } from '@common/base/base.entity';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(UpdateRecruitmentPostCommentHandler.name, () => {
  let handler: UpdateRecruitmentPostCommentHandler;

  let projectRepository: ProjectRepositoryPort;
  let projectRecruitmentPostRepository: ProjectRecruitmentPostRepositoryPort;
  let commentRepository: CommentRepositoryPort;
  let eventStore: IEventStore;

  let command: UpdateRecruitmentPostCommentCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ProjectRepositoryModule,
        ProjectRecruitmentPostRepositoryModule,
        CommentRepositoryModule,
        EventStoreModule,
      ],
      providers: [UpdateRecruitmentPostCommentHandler],
    }).compile();

    handler = module.get<UpdateRecruitmentPostCommentHandler>(
      UpdateRecruitmentPostCommentHandler,
    );

    projectRepository = module.get<ProjectRepositoryPort>(PROJECT_REPOSITORY);
    projectRecruitmentPostRepository =
      module.get<ProjectRecruitmentPostRepositoryPort>(
        PROJECT_RECRUITMENT_POST_REPOSITORY,
      );
    commentRepository = module.get<CommentRepositoryPort>(COMMENT_REPOSITORY);
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = UpdateRecruitmentPostCommentCommandFactory.build();

    jest.spyOn(eventStore, 'storeAggregateEvents');
  });

  describe('식별자와 일치하는 프로젝트가 존재하고', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let project: Project;

    beforeEach(async () => {
      project = await projectRepository.insert(
        ProjectFactory.build({ id: command.projectId }),
      );
    });

    describe('식별자와 일치하는 모집게시글이 존재하고', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let post: ProjectRecruitmentPost;

      beforeEach(async () => {
        post = await projectRecruitmentPostRepository.insert(
          ProjectRecruitmentPostFactory.build({
            id: command.postId,
            projectId: command.projectId,
          }),
        );
      });

      describe('식별자와 일치하는 댓글이 존재하고', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let comment: Comment;

        beforeEach(async () => {
          comment = await commentRepository.insert(
            CommentFactory.build({
              id: command.commentId,
              authorId: command.currentUserId,
              postId: command.postId,
              postType: CommentPostType.recruitmentPost,
              description: command.description,
            }),
          );
        });

        describe('본인이 댓글을 수정하면', () => {
          it('모집 게시글 댓글이 업데이트돼야한다.', async () => {
            await expect(handler.execute(command)).resolves.toEqual(
              expect.objectContaining({
                id: command.commentId,
                authorId: command.currentUserId,
                postId: command.postId,
                description: command.description,
              }),
            );
            expect(eventStore.storeAggregateEvents).toHaveBeenCalled();
          });
        });

        describe('본인의 댓글이 아닌 댓글을 수정하면', () => {
          it('댓글을 수정할 수 없다는 에러가 발생해야한다.', async () => {
            await expect(
              handler.execute({
                ...command,
                currentUserId: generateEntityId(),
              }),
            ).rejects.toThrow(
              ProjectRecruitmentPostCommentUpdateRestrictedError,
            );
          });
        });
      });

      describe('식별자와 일치하는 모집 게시글 댓글이 존재하지 않는 경우', () => {
        describe('모집 게시글 댓글을 수정하면', () => {
          it('모집 게시글 댓글이 존재하지 않는다는 에러가 발생해야한다.', async () => {
            await expect(handler.execute(command)).rejects.toThrow(
              ProjectRecruitmentPostCommentNotFoundError,
            );
          });
        });
      });
    });

    describe('식별자와 일치하는 모집 게시글이 존재하지 않는 경우', () => {
      describe('댓글 목록을 수정하면', () => {
        it('모집 게시글이 존재하지 않는다는 에러가 발생해야한다.', async () => {
          await expect(handler.execute(command)).rejects.toThrow(
            ProjectRecruitmentPostNotFoundError,
          );
        });
      });
    });
  });

  describe('식별자와 일치하는 프로젝트가 존재하지 않는 경우', () => {
    describe('댓글 목록을 수정하면', () => {
      it('프로젝트가 존재하지 않는다는 에러가 발생해야한다.', async () => {
        await expect(handler.execute(command)).rejects.toThrow(
          ProjectNotFoundError,
        );
      });
    });
  });
});
