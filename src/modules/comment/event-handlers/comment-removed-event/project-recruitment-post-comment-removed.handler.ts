import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';

import { CommentPostType } from '@module/comment/entities/comment.entity';
import { CommentRemovedEvent } from '@module/comment/events/comment-removed.event';
import {
  PROJECT_RECRUITMENT_POST_REPOSITORY,
  ProjectRecruitmentPostRepositoryPort,
} from '@module/project/repositories/project-recruitment-post.repository.port';

@EventsHandler(CommentRemovedEvent)
export class ProjectRecruitmentPostCommentRemovedHandler
  implements IEventHandler<CommentRemovedEvent>
{
  constructor(
    @Inject(PROJECT_RECRUITMENT_POST_REPOSITORY)
    private readonly projectRecruitmentPostRepositoryPort: ProjectRecruitmentPostRepositoryPort,
  ) {}

  @OnEvent(CommentRemovedEvent.name)
  async handle(event: CommentRemovedEvent) {
    const { eventPayload } = event;

    if (eventPayload.postType !== CommentPostType.recruitmentPost) {
      return;
    }

    await this.projectRecruitmentPostRepositoryPort.decrementCommentsCount(
      eventPayload.postId,
    );
  }
}
