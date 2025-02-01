import { Module } from '@nestjs/common';

import { CreateRecruitmentPostCommentModule } from '@module/comment/use-cases/create-recruitment-post-comment/create-recruitment-post-comment.module';
import { ListRecruitmentPostCommentsModule } from '@module/comment/use-cases/list-recruitment-post-comments/list-recruitment-post-comments.module';

@Module({
  imports: [
    CreateRecruitmentPostCommentModule,
    ListRecruitmentPostCommentsModule,
  ],
})
export class CommentModule {}
