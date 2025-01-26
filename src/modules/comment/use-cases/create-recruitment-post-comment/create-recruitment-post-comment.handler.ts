import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Comment } from '@module/comment/entities/comment.entity';
import {
  COMMENT_REPOSITORY,
  CommentRepositoryPort,
} from '@module/comment/repositories/comment.repository.port';
import { CreateRecruitmentPostCommentCommand } from '@module/comment/use-cases/create-recruitment-post-comment/create-recruitment-post-comment.command';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectRecruitmentPostNotFoundError } from '@module/project/errors/project-recruitment-not-found.error';
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

@CommandHandler(CreateRecruitmentPostCommentCommand)
export class CreateRecruitmentPostCommentHandler
  implements ICommandHandler<CreateRecruitmentPostCommentCommand, Comment>
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositoryPort,
    @Inject(PROJECT_RECRUITMENT_POST_REPOSITORY)
    private readonly projectRecruitmentPostRepository: ProjectRecruitmentPostRepositoryPort,
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepositoryPort,
    @Inject(EVENT_STORE) private readonly eventStore: IEventStore,
  ) {}

  async execute(
    command: CreateRecruitmentPostCommentCommand,
  ): Promise<Comment> {
    const [project, post] = await Promise.all([
      this.projectRepository.findOneById(command.projectId),
      this.projectRecruitmentPostRepository.findOneById(command.postId),
    ]);

    if (project === undefined) {
      throw new ProjectNotFoundError();
    }

    if (post === undefined) {
      throw new ProjectRecruitmentPostNotFoundError();
    }

    const comment = Comment.create({
      postId: command.postId,
      authorId: command.authorId,
      postType: command.postType,
      description: command.description,
    });

    await this.commentRepository.insert(comment);

    await this.eventStore.storeAggregateEvents(comment);

    return comment;
  }
}
