import { Module } from '@nestjs/common';

import { CreateRecruitmentPostCommentModule } from '@module/comment/use-cases/create-recruitment-post-comment/create-recruitment-post-comment.module';

@Module({
  imports: [CreateRecruitmentPostCommentModule],
})
export class CommentModule {}
