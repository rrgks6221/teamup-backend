import { Module } from '@nestjs/common';

import { ProjectRecruitmentPostCommentRemovedHandler } from '@module/comment/event-handlers/comment-removed-event/project-recruitment-post-comment-removed.handler';
import { ProjectRecruitmentPostRepositoryModule } from '@module/project/repositories/project-recruitment-post.repository.module';

@Module({
  imports: [ProjectRecruitmentPostRepositoryModule],
  providers: [ProjectRecruitmentPostCommentRemovedHandler],
})
export class CommentRemovedModule {}
