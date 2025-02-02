import { Module } from '@nestjs/common';

import { CommentRepositoryModule } from '@module/comment/repositories/comment.repository.module';
import { GetRecruitmentPostCommentController } from '@module/comment/use-cases/get-recruitment-post-comment/get-recruitment-post-comment.controller';
import { GetRecruitmentPostCommentHandler } from '@module/comment/use-cases/get-recruitment-post-comment/get-recruitment-post-comment.handler';
import { ProjectRecruitmentPostRepositoryModule } from '@module/project/repositories/project-recruitment-post.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';

@Module({
  imports: [
    ProjectRepositoryModule,
    ProjectRecruitmentPostRepositoryModule,
    CommentRepositoryModule,
  ],
  controllers: [GetRecruitmentPostCommentController],
  providers: [GetRecruitmentPostCommentHandler],
})
export class GetRecruitmentPostCommentModule {}
