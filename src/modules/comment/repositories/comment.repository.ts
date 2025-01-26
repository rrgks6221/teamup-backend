import { Inject, Injectable } from '@nestjs/common';

import { Comment } from '@module/comment/entities/comment.entity';
import { CommentMapper } from '@module/comment/mappers/comment.mapper';
import {
  CommentRaw,
  CommentRepositoryPort,
} from '@module/comment/repositories/comment.repository.port';

import {
  BaseRepository,
  ICursorPaginated,
  ICursorPaginatedParams,
} from '@common/base/base.repository';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class CommentRepository
  extends BaseRepository<Comment, CommentRaw>
  implements CommentRepositoryPort
{
  protected TABLE_NAME = 'comment';

  constructor(
    @Inject(PRISMA_SERVICE) protected readonly prismaService: PrismaService,
  ) {
    super(prismaService, CommentMapper);
  }

  findAllCursorPaginated(
    params: ICursorPaginatedParams,
  ): Promise<ICursorPaginated<Comment>> {
    throw new Error('Method not implemented.');
  }
}
