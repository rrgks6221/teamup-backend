import { Module } from '@nestjs/common';

import { ProjectRecruitmentPostCommentCreatedHandler } from '@module/comment/event-handlers/comment-created-event/project-recruitment-post-comment-created.handler';
import { ProjectRecruitmentPostRepositoryModule } from '@module/project/repositories/project-recruitment-post.repository.module';

@Module({
  imports: [ProjectRecruitmentPostRepositoryModule],
  providers: [ProjectRecruitmentPostCommentCreatedHandler],
})
export class CommentCreatedModule {}
