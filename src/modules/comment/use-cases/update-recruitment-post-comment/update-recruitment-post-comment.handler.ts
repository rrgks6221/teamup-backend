import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Comment } from '@module/comment/entities/comment.entity';
import {
  COMMENT_REPOSITORY,
  CommentRepositoryPort,
} from '@module/comment/repositories/comment.repository.port';
import { UpdateRecruitmentPostCommentCommand } from '@module/comment/use-cases/update-recruitment-post-comment/update-recruitment-post-comment.command';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectRecruitmentPostNotFoundError } from '@module/project/errors/project-recruitment-not-found.error';
import { ProjectRecruitmentPostCommentNotFoundError } from '@module/project/errors/project-recruitment-post-comment-not-found.error';
import { ProjectRecruitmentPostCommentUpdateRestrictedError } from '@module/project/errors/project-recruitment-post-comment-update-restricted.error';
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

@CommandHandler(UpdateRecruitmentPostCommentCommand)
export class UpdateRecruitmentPostCommentHandler
  implements ICommandHandler<UpdateRecruitmentPostCommentCommand, Comment>
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

  async execute(
    command: UpdateRecruitmentPostCommentCommand,
  ): Promise<Comment> {
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
      throw new ProjectRecruitmentPostCommentUpdateRestrictedError();
    }

    comment.update({
      description: command.description,
    });

    await this.commentRepository.update(comment);

    await this.eventStore.storeAggregateEvents(comment);

    return comment;
  }
}
