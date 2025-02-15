import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { CommentPostType } from '@module/comment/entities/comment.entity';
import { ProjectRecruitmentPostCommentCreatedHandler } from '@module/comment/event-handlers/comment-created-event/project-recruitment-post-comment-created.handler';
import { CommentCreatedEvent } from '@module/comment/events/comment-created.event';
import { ProjectRecruitmentPostFactory } from '@module/project/entities/__spec__/project-recruitment-post.factory';
import { ProjectRecruitmentPostRepositoryModule } from '@module/project/repositories/project-recruitment-post.repository.module';
import {
  PROJECT_RECRUITMENT_POST_REPOSITORY,
  ProjectRecruitmentPostRepositoryPort,
} from '@module/project/repositories/project-recruitment-post.repository.port';

import { generateEntityId } from '@common/base/base.entity';

describe(ProjectRecruitmentPostCommentCreatedHandler.name, () => {
  let handler: ProjectRecruitmentPostCommentCreatedHandler;

  let projectRecruitmentPostRepository: ProjectRecruitmentPostRepositoryPort;

  let event: CommentCreatedEvent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProjectRecruitmentPostRepositoryModule],
      providers: [ProjectRecruitmentPostCommentCreatedHandler],
    }).compile();

    handler = module.get<ProjectRecruitmentPostCommentCreatedHandler>(
      ProjectRecruitmentPostCommentCreatedHandler,
    );

    projectRecruitmentPostRepository =
      module.get<ProjectRecruitmentPostRepositoryPort>(
        PROJECT_RECRUITMENT_POST_REPOSITORY,
      );
  });

  beforeEach(async () => {
    event = new CommentCreatedEvent(generateEntityId(), {
      authorId: generateEntityId(),
      postId: generateEntityId(),
      postType: CommentPostType.recruitmentPost,
      description: faker.string.alpha(),
    });

    jest.spyOn(projectRecruitmentPostRepository, 'incrementCommentsCount');

    await projectRecruitmentPostRepository.insert(
      ProjectRecruitmentPostFactory.build({ id: event.eventPayload.postId }),
    );
  });

  describe('생성된 댓글이 프로젝트 모집 게시글 댓글인 경우', () => {
    it('게시글의 댓글 개수가 증가해야한다.', async () => {
      await expect(handler.handle(event)).resolves.toBeUndefined();
      expect(
        projectRecruitmentPostRepository.incrementCommentsCount,
      ).toHaveBeenCalled();
    });
  });

  describe('생성된 댓글이 프로젝트 모집 게시글 댓글이 아닌 경우', () => {
    it('아무 일도 일어나지 않아야한다.', async () => {
      await expect(
        handler.handle({
          ...event,
          eventPayload: {
            ...event.eventPayload,
            postType: 'UnknownPostType' as CommentPostType,
          },
        }),
      ).resolves.toBeUndefined();
      expect(
        projectRecruitmentPostRepository.incrementCommentsCount,
      ).not.toHaveBeenCalled();
    });
  });
});
