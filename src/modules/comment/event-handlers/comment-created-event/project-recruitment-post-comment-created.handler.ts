import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';

import { CommentPostType } from '@module/comment/entities/comment.entity';
import { CommentCreatedEvent } from '@module/comment/events/comment-created.event';
import {
  PROJECT_RECRUITMENT_POST_REPOSITORY,
  ProjectRecruitmentPostRepositoryPort,
} from '@module/project/repositories/project-recruitment-post.repository.port';

@EventsHandler(CommentCreatedEvent)
export class ProjectRecruitmentPostCommentCreatedHandler
  implements IEventHandler<CommentCreatedEvent>
{
  constructor(
    @Inject(PROJECT_RECRUITMENT_POST_REPOSITORY)
    private readonly projectRecruitmentPostRepositoryPort: ProjectRecruitmentPostRepositoryPort,
  ) {}

  @OnEvent(CommentCreatedEvent.name)
  async handle(event: CommentCreatedEvent) {
    const { eventPayload } = event;

    if (eventPayload.postType !== CommentPostType.recruitmentPost) {
      return;
    }

    await this.projectRecruitmentPostRepositoryPort.incrementCommentsCount(
      eventPayload.postId,
    );
  }
}
