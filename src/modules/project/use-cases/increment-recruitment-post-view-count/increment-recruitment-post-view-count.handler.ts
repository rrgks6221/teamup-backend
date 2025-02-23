import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ProjectRecruitmentPostNotFoundError } from '@module/project/errors/project-recruitment-not-found.error';
import {
  PROJECT_RECRUITMENT_POST_REPOSITORY,
  ProjectRecruitmentPostRepositoryPort,
} from '@module/project/repositories/project-recruitment-post.repository.port';
import { IncrementRecruitmentPostViewCountCommand } from '@module/project/use-cases/increment-recruitment-post-view-count/increment-recruitment-post-view-count.command';

import { RecordNotFoundError } from '@common/base/base.error';

@CommandHandler(IncrementRecruitmentPostViewCountCommand)
export class IncrementRecruitmentPostViewCountHandler
  implements ICommandHandler<IncrementRecruitmentPostViewCountCommand, void>
{
  constructor(
    @Inject(PROJECT_RECRUITMENT_POST_REPOSITORY)
    private readonly projectRecruitmentPostRepository: ProjectRecruitmentPostRepositoryPort,
  ) {}

  async execute(
    command: IncrementRecruitmentPostViewCountCommand,
  ): Promise<void> {
    try {
      await this.projectRecruitmentPostRepository.incrementViewCount(
        command.postId,
      );
    } catch (error) {
      if (error instanceof RecordNotFoundError) {
        throw new ProjectRecruitmentPostNotFoundError();
      }

      throw error;
    }
  }
}
