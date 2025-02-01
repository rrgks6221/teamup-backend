import { Inject, Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { Comment } from '@module/comment/entities/comment.entity';
import { CommentMapper } from '@module/comment/mappers/comment.mapper';
import {
  CommentFilter,
  CommentOrder,
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

  async findAllCursorPaginated(
    params: ICursorPaginatedParams<CommentOrder, CommentFilter>,
  ): Promise<ICursorPaginated<Comment>> {
    const { limit = 20, cursor, orderBy, filter } = params;

    const myCursor =
      cursor === undefined
        ? undefined
        : {
            id: BigInt(cursor),
          };

    const where: Prisma.CommentWhereInput = {};

    if (filter !== undefined) {
      where.postType = filter.postType;
      where.postId = this.mapper.toPrimaryKey(filter.postId);
    }

    const myOrder: Prisma.CommentOrderByWithRelationInput = {};

    if (orderBy !== undefined) {
      Object.assign(myOrder, orderBy);
    } else {
      myOrder.id = 'asc';
    }

    const comments = await this.prismaService.comment.findMany({
      take: limit + 1,
      cursor: myCursor,
      skip: myCursor === undefined ? undefined : 1,
      where,
      orderBy: myOrder,
    });

    let nextCursor: string | undefined;
    if (comments.at(limit) !== undefined) {
      nextCursor = comments.at(limit - 1)?.id?.toString();
      comments.pop();
    }

    return {
      cursor: nextCursor,
      data: comments.map((comment) => this.mapper.toEntity(comment)),
    };
  }
}
