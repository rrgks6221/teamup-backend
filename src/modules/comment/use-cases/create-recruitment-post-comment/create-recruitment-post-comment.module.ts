import { Module } from '@nestjs/common';

import { CommentRepositoryModule } from '@module/comment/repositories/comment.repository.module';
import { CreateRecruitmentPostCommentController } from '@module/comment/use-cases/create-recruitment-post-comment/create-recruitment-post-comment.controller';
import { CreateRecruitmentPostCommentHandler } from '@module/comment/use-cases/create-recruitment-post-comment/create-recruitment-post-comment.handler';
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
  controllers: [CreateRecruitmentPostCommentController],
  providers: [CreateRecruitmentPostCommentHandler],
})
export class CreateRecruitmentPostCommentModule {}
