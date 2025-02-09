import { Module } from '@nestjs/common';

import { CommentRepositoryModule } from '@module/comment/repositories/comment.repository.module';
import { UpdateRecruitmentPostCommentController } from '@module/comment/use-cases/update-recruitment-post-comment/update-recruitment-post-comment.controller';
import { UpdateRecruitmentPostCommentHandler } from '@module/comment/use-cases/update-recruitment-post-comment/update-recruitment-post-comment.handler';
import { ProjectRecruitmentPostRepositoryModule } from '@module/project/repositories/project-recruitment-post.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    ProjectRepositoryModule,
    ProjectRecruitmentPostRepositoryModule,
    CommentRepositoryModule,
    EventStoreModule,
  ],
  controllers: [UpdateRecruitmentPostCommentController],
  providers: [UpdateRecruitmentPostCommentHandler],
})
export class UpdateRecruitmentPostCommentModule {}
