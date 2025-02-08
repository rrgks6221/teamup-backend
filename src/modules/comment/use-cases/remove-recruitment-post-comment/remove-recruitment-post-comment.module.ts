import { Module } from '@nestjs/common';

import { CommentRepositoryModule } from '@module/comment/repositories/comment.repository.module';
import { RemoveRecruitmentPostCommentController } from '@module/comment/use-cases/remove-recruitment-post-comment/remove-recruitment-post-comment.controller';
import { RemoveRecruitmentPostCommentHandler } from '@module/comment/use-cases/remove-recruitment-post-comment/remove-recruitment-post-comment.handler';
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
  controllers: [RemoveRecruitmentPostCommentController],
  providers: [RemoveRecruitmentPostCommentHandler],
})
export class RemoveRecruitmentPostCommentModule {}
