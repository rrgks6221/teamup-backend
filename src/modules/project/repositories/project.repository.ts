import { Inject, Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { Project } from '@module/project/entities/project.entity';
import { ProjectMapper } from '@module/project/mappers/project.mapper';
import {
  ProjectFilter,
  ProjectOrder,
  ProjectRaw,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';

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
export class ProjectRepository
  extends BaseRepository<Project, ProjectRaw>
  implements ProjectRepositoryPort
{
  protected TABLE_NAME = 'project';

  constructor(
    @Inject(PRISMA_SERVICE) protected readonly prismaService: PrismaService,
  ) {
    super(prismaService, ProjectMapper);
  }

  async incrementMemberCount(projectId: EntityId): Promise<number> {
    try {
      const updatedProject = await this.prismaService.project.update({
        where: {
          id: this.mapper.toPrimaryKey(projectId),
        },
        data: {
          currentMemberCount: {
            increment: 1,
          },
        },
      });

      return updatedProject.currentMemberCount;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new RecordNotFoundError();
        }
      }

      throw error;
    }
  }

  async decrementMemberCount(projectId: EntityId): Promise<number> {
    try {
      const updatedProject = await this.prismaService.project.update({
        where: {
          id: this.mapper.toPrimaryKey(projectId),
        },
        data: {
          currentMemberCount: {
            decrement: 1,
          },
        },
      });

      return updatedProject.currentMemberCount;
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
    params: ICursorPaginatedParams<ProjectOrder, ProjectFilter>,
  ): Promise<ICursorPaginated<Project>> {
    const { limit = 20, cursor, orderBy, filter = {} } = params;

    const myCursor =
      cursor === undefined
        ? undefined
        : {
            id: BigInt(cursor),
          };

    const where: Prisma.ProjectWhereInput = {};

    if (filter.statuses !== undefined) {
      where.status = {
        in: Array.from(filter.statuses),
      };
    }

    const myOrder: Prisma.ProjectOrderByWithRelationInput = {};

    if (orderBy !== undefined) {
      Object.assign(myOrder, orderBy);
    } else {
      myOrder.id = 'asc';
    }

    const projects = await this.prismaService.project.findMany({
      take: limit + 1,
      cursor: myCursor,
      skip: myCursor === undefined ? undefined : 1,
      where,
      orderBy: myOrder,
    });

    let nextCursor: string | undefined;
    if (projects.at(limit) !== undefined) {
      nextCursor = projects.at(limit - 1)?.id?.toString();
      projects.pop();
    }

    return {
      cursor: nextCursor,
      data: projects.map((project) => this.mapper.toEntity(project)),
    };
  }
}
