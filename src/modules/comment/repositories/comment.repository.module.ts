import { Module } from '@nestjs/common';

import { CommentRepository } from '@module/comment/repositories/comment.repository';
import { COMMENT_REPOSITORY } from '@module/comment/repositories/comment.repository.port';

import { PrismaModule } from '@shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: COMMENT_REPOSITORY,
      useClass: CommentRepository,
    },
  ],
  exports: [COMMENT_REPOSITORY],
})
export class CommentRepositoryModule {}
