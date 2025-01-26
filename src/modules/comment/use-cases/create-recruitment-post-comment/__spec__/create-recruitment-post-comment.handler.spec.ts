import { Test, TestingModule } from '@nestjs/testing';

import { CommentRepositoryModule } from '@module/comment/repositories/comment.repository.module';
import {
  COMMENT_REPOSITORY,
  CommentRepositoryPort,
} from '@module/comment/repositories/comment.repository.port';
import { CreateRecruitmentPostCommentCommandFactory } from '@module/comment/use-cases/create-recruitment-post-comment/__spec__/create-recruitment-post-comment-command.factory';
import { CreateRecruitmentPostCommentCommand } from '@module/comment/use-cases/create-recruitment-post-comment/create-recruitment-post-comment.command';
import { CreateRecruitmentPostCommentHandler } from '@module/comment/use-cases/create-recruitment-post-comment/create-recruitment-post-comment.handler';
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

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(CreateRecruitmentPostCommentHandler.name, () => {
  let handler: CreateRecruitmentPostCommentHandler;

  let projectRepository: ProjectRepositoryPort;
  let projectRecruitmentPostRepository: ProjectRecruitmentPostRepositoryPort;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let commentRepository: CommentRepositoryPort;
  let eventStore: IEventStore;

  let command: CreateRecruitmentPostCommentCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ProjectRepositoryModule,
        ProjectRecruitmentPostRepositoryModule,
        CommentRepositoryModule,
        EventStoreModule,
      ],
      providers: [CreateRecruitmentPostCommentHandler],
    }).compile();

    handler = module.get<CreateRecruitmentPostCommentHandler>(
      CreateRecruitmentPostCommentHandler,
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
    command = CreateRecruitmentPostCommentCommandFactory.build();

    jest.spyOn(eventStore, 'storeAggregateEvents');
  });

  describe('식별자와 일치하는 프로젝트가 존재하고', () => {
    beforeEach(async () => {
      await projectRepository.insert(
        ProjectFactory.build({ id: command.projectId }),
      );
    });

    describe('식별자와 일치하는 모집 게시글이 존재하는 경우', () => {
      beforeEach(async () => {
        await projectRecruitmentPostRepository.insert(
          ProjectRecruitmentPostFactory.build({
            id: command.postId,
            projectId: command.projectId,
          }),
        );
      });

      describe('댓글을 생성하면', () => {
        it('댓글이 생성된다.', async () => {
          await expect(handler.execute(command)).resolves.toEqual(
            expect.objectContaining({
              postId: command.postId,
              authorId: command.authorId,
              postType: command.postType,
              description: command.description,
            }),
          );

          expect(eventStore.storeAggregateEvents).toHaveBeenCalled();
        });
      });
    });

    describe('식별자와 일치하는 모집 게시글이 존재하지 않는 경우', () => {
      describe('댓글을 생성하면', () => {
        it('모집 게시글이 존재하지 않는다는 에러가 발생한다', async () => {
          await expect(handler.execute(command)).rejects.toThrow(
            ProjectRecruitmentPostNotFoundError,
          );
        });
      });
    });
  });

  describe('식별자와 일치하는 프로젝트가 존재하지 않는 경우', () => {
    describe('댓글을 생성하면', () => {
      it('프로젝트가 존재하지 않는다는 에러가 발생한다', async () => {
        await expect(handler.execute(command)).rejects.toThrow(
          ProjectNotFoundError,
        );
      });
    });
  });
});
