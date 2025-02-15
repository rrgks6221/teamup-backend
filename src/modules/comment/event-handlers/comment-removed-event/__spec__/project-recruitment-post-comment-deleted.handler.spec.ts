import { Test, TestingModule } from '@nestjs/testing';

import { CommentPostType } from '@module/comment/entities/comment.entity';
import { ProjectRecruitmentPostCommentRemovedHandler } from '@module/comment/event-handlers/comment-removed-event/project-recruitment-post-comment-removed.handler';
import { CommentRemovedEvent } from '@module/comment/events/comment-removed.event';
import { ProjectRecruitmentPostFactory } from '@module/project/entities/__spec__/project-recruitment-post.factory';
import { ProjectRecruitmentPostRepositoryModule } from '@module/project/repositories/project-recruitment-post.repository.module';
import {
  PROJECT_RECRUITMENT_POST_REPOSITORY,
  ProjectRecruitmentPostRepositoryPort,
} from '@module/project/repositories/project-recruitment-post.repository.port';

import { generateEntityId } from '@common/base/base.entity';

describe(ProjectRecruitmentPostCommentRemovedHandler.name, () => {
  let handler: ProjectRecruitmentPostCommentRemovedHandler;

  let projectRecruitmentPostRepository: ProjectRecruitmentPostRepositoryPort;

  let event: CommentRemovedEvent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProjectRecruitmentPostRepositoryModule],
      providers: [ProjectRecruitmentPostCommentRemovedHandler],
    }).compile();

    handler = module.get<ProjectRecruitmentPostCommentRemovedHandler>(
      ProjectRecruitmentPostCommentRemovedHandler,
    );

    projectRecruitmentPostRepository =
      module.get<ProjectRecruitmentPostRepositoryPort>(
        PROJECT_RECRUITMENT_POST_REPOSITORY,
      );
  });

  beforeEach(async () => {
    event = new CommentRemovedEvent(generateEntityId(), {
      postId: generateEntityId(),
      postType: CommentPostType.recruitmentPost,
    });

    jest.spyOn(projectRecruitmentPostRepository, 'decrementCommentsCount');

    await projectRecruitmentPostRepository.insert(
      ProjectRecruitmentPostFactory.build({ id: event.eventPayload.postId }),
    );
  });

  describe('삭제된 댓글이 프로젝트 모집 게시글 댓글인 경우', () => {
    it('게시글의 댓글 개수가 감소해야한다.', async () => {
      await expect(handler.handle(event)).resolves.toBeUndefined();
      expect(
        projectRecruitmentPostRepository.decrementCommentsCount,
      ).toHaveBeenCalled();
    });
  });

  describe('삭제된 댓글이 프로젝트 모집 게시글 댓글이 아닌 경우', () => {
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
        projectRecruitmentPostRepository.decrementCommentsCount,
      ).not.toHaveBeenCalled();
    });
  });
});
