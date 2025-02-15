import { Inject, Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { ProjectRecruitmentPost } from '@module/project/entities/project-recruitment-post.entity';
import { ProjectRecruitmentPostMapper } from '@module/project/mappers/project-recruitment-post.mapper';
import {
  ProjectRecruitmentPostFilter,
  ProjectRecruitmentPostOrder,
  ProjectRecruitmentPostRaw,
  ProjectRecruitmentPostRepositoryPort,
} from '@module/project/repositories/project-recruitment-post.repository.port';

import { EntityId } from '@common/base/base.entity';
import { RecordNotFoundError } from '@common/base/base.error';
import {
  BaseRepository,
  ICursorPaginated,
  ICursorPaginatedParams,
} from '@common/base/base.repository';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class ProjectRecruitmentPostRepository
  extends BaseRepository<ProjectRecruitmentPost, ProjectRecruitmentPostRaw>
  implements ProjectRecruitmentPostRepositoryPort
{
  protected TABLE_NAME = 'projectRecruitmentPost';

  constructor(
    @Inject(PRISMA_SERVICE) protected readonly prismaService: PrismaService,
  ) {
    super(prismaService, ProjectRecruitmentPostMapper);
  }

  async incrementCommentsCount(projectId: EntityId): Promise<number> {
    try {
      const updatedProject =
        await this.prismaService.projectRecruitmentPost.update({
          where: {
            id: this.mapper.toPrimaryKey(projectId),
          },
          data: {
            commentsCount: {
              increment: 1,
            },
          },
        });

      return updatedProject.commentsCount;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new RecordNotFoundError();
        }
      }

      throw error;
    }
  }

  async decrementCommentsCount(projectId: EntityId): Promise<number> {
    try {
      const updatedProject =
        await this.prismaService.projectRecruitmentPost.update({
          where: {
            id: this.mapper.toPrimaryKey(projectId),
          },
          data: {
            commentsCount: {
              decrement: 1,
            },
          },
        });

      return updatedProject.commentsCount;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new RecordNotFoundError();
        }
      }

      throw error;
    }
  }

  async findAllCursorPaginated(
    params: ICursorPaginatedParams<
      ProjectRecruitmentPostOrder,
      ProjectRecruitmentPostFilter
    >,
  ): Promise<ICursorPaginated<ProjectRecruitmentPost>> {
    const { limit = 20, cursor, orderBy, filter = {} } = params;

    const myCursor =
      cursor === undefined
        ? undefined
        : {
            id: BigInt(cursor),
          };

    const where: Prisma.ProjectRecruitmentPostWhereInput = {};

    if (filter.projectId !== undefined) {
      where.projectId = this.mapper.toPrimaryKey(filter.projectId);
    }

    const myOrder: Prisma.ProjectRecruitmentPostOrderByWithRelationInput = {};

    if (orderBy !== undefined) {
      Object.assign(myOrder, orderBy);
    } else {
      myOrder.id = 'asc';
    }

    const projectRecruitmentPosts =
      await this.prismaService.projectRecruitmentPost.findMany({
        take: limit + 1,
        cursor: myCursor,
        skip: myCursor === undefined ? undefined : 1,
        where,
        orderBy: myOrder,
      });

    let nextCursor: string | undefined;
    if (projectRecruitmentPosts.at(limit) !== undefined) {
      nextCursor = projectRecruitmentPosts.at(limit - 1)?.id?.toString();
      projectRecruitmentPosts.pop();
    }

    return {
      cursor: nextCursor,
      data: projectRecruitmentPosts.map((projectRecruitmentPost) =>
        this.mapper.toEntity(projectRecruitmentPost),
      ),
    };
  }
}
