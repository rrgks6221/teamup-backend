import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  COMMENT_REPOSITORY,
  CommentRepositoryPort,
} from '@module/comment/repositories/comment.repository.port';
import { RemoveRecruitmentPostCommentCommand } from '@module/comment/use-cases/remove-recruitment-post-comment/remove-recruitment-post-comment.command';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectRecruitmentPostNotFoundError } from '@module/project/errors/project-recruitment-not-found.error';
import { ProjectRecruitmentPostCommentDeletionRestrictedError } from '@module/project/errors/project-recruitment-post-comment-deletion-restricted.error';
import { ProjectRecruitmentPostCommentNotFoundError } from '@module/project/errors/project-recruitment-post-comment-not-found.error';
import {
  PROJECT_RECRUITMENT_POST_REPOSITORY,
  ProjectRecruitmentPostRepositoryPort,
} from '@module/project/repositories/project-recruitment-post.repository.port';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(RemoveRecruitmentPostCommentCommand)
export class RemoveRecruitmentPostCommentHandler
  implements ICommandHandler<RemoveRecruitmentPostCommentCommand, void>
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositoryPort,
    @Inject(PROJECT_RECRUITMENT_POST_REPOSITORY)
    private readonly projectRecruitmentPostRepository: ProjectRecruitmentPostRepositoryPort,
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepositoryPort,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  async execute(command: RemoveRecruitmentPostCommentCommand): Promise<void> {
    const [project, post, comment] = await Promise.all([
      this.projectRepository.findOneById(command.projectId),
      this.projectRecruitmentPostRepository.findOneById(command.postId),
      this.commentRepository.findOneById(command.commentId),
    ]);

    if (project === undefined) {
      throw new ProjectNotFoundError();
    }

    if (post === undefined) {
      throw new ProjectRecruitmentPostNotFoundError();
    }

    if (comment === undefined) {
      throw new ProjectRecruitmentPostCommentNotFoundError();
    }

    if (comment.authorId !== command.currentUserId) {
      throw new ProjectRecruitmentPostCommentDeletionRestrictedError();
    }

    comment.remove();

    await this.commentRepository.delete(comment);

    await this.eventStore.storeAggregateEvents(comment);
  }
}
