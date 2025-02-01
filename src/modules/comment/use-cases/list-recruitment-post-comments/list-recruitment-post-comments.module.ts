import { Module } from '@nestjs/common';

import { CommentRepositoryModule } from '@module/comment/repositories/comment.repository.module';
import { ListRecruitmentPostCommentsController } from '@module/comment/use-cases/list-recruitment-post-comments/list-recruitment-post-comments.controller';
import { ListRecruitmentPostCommentsHandler } from '@module/comment/use-cases/list-recruitment-post-comments/list-recruitment-post-comments.handler';
import { ProjectRecruitmentPostRepositoryModule } from '@module/project/repositories/project-recruitment-post.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';

@Module({
  imports: [
    ProjectRepositoryModule,
    ProjectRecruitmentPostRepositoryModule,
    CommentRepositoryModule,
  ],
  controllers: [ListRecruitmentPostCommentsController],
  providers: [ListRecruitmentPostCommentsHandler],
})
export class ListRecruitmentPostCommentsModule {}
