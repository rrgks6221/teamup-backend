import { Module } from '@nestjs/common';

import { CreateRecruitmentPostCommentModule } from '@module/comment/use-cases/create-recruitment-post-comment/create-recruitment-post-comment.module';
import { GetRecruitmentPostCommentModule } from '@module/comment/use-cases/get-recruitment-post-comment/get-recruitment-post-comment.module';
import { ListRecruitmentPostCommentsModule } from '@module/comment/use-cases/list-recruitment-post-comments/list-recruitment-post-comments.module';
import { RemoveRecruitmentPostCommentModule } from '@module/comment/use-cases/remove-recruitment-post-comment/remove-recruitment-post-comment.module';
import { UpdateRecruitmentPostCommentModule } from '@module/comment/use-cases/update-recruitment-post-comment/update-recruitment-post-comment.module';

@Module({
  imports: [
    CreateRecruitmentPostCommentModule,
    ListRecruitmentPostCommentsModule,
    GetRecruitmentPostCommentModule,
    RemoveRecruitmentPostCommentModule,
    UpdateRecruitmentPostCommentModule,
  ],
})
export class CommentModule {}
