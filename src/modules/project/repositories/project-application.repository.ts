import { Inject, Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { ProjectApplication } from '@module/project/entities/project-application.entity';
import { ProjectApplicationMapper } from '@module/project/mappers/project-application.mapper';
import {
  ProjectApplicationFilter,
  ProjectApplicationOrder,
  ProjectApplicationRaw,
  ProjectApplicationRepositoryPort,
} from '@module/project/repositories/project-application.repository.port';

import {
  BaseRepository,
  ICursorPaginated,
  ICursorPaginatedParams,
} from '@common/base/base.repository';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class ProjectApplicationRepository
  extends BaseRepository<ProjectApplication, ProjectApplicationRaw>
  implements ProjectApplicationRepositoryPort
{
  protected TABLE_NAME = 'projectApplication';

  constructor(
    @Inject(PRISMA_SERVICE) protected readonly prismaService: PrismaService,
  ) {
    super(prismaService, ProjectApplicationMapper);
  }

  async findByProjectApplicant(
    projectId: string,
    applicantId: string,
  ): Promise<ProjectApplication[]> {
    if (isNaN(Number(projectId)) || isNaN(Number(applicantId))) {
      return [];
    }

    const raws = await this.prismaService.projectApplication.findMany({
      where: {
        projectId: this.mapper.toPrimaryKey(projectId),
        applicantId: this.mapper.toPrimaryKey(applicantId),
      },
      orderBy: {
        id: 'asc',
      },
    });

    return raws.map((raw) => this.mapper.toEntity(raw));
  }

  async findAllCursorPaginated(
    params: ICursorPaginatedParams<
      ProjectApplicationOrder,
      ProjectApplicationFilter
    >,
  ): Promise<ICursorPaginated<ProjectApplication>> {
    const { limit = 20, cursor, orderBy, filter } = params;

    const myCursor =
      cursor === undefined
        ? undefined
        : {
            id: BigInt(cursor),
          };

    const where: Prisma.ProjectApplicationWhereInput = {};

    if (filter !== undefined) {
      if (filter.projectId !== undefined) {
        where.projectId = this.mapper.toPrimaryKey(filter.projectId);
      }
      if (filter.status !== undefined) {
        where.status = filter.status;
      }
    }

    const myOrder: Prisma.ProjectApplicationOrderByWithRelationInput = {};

    if (orderBy !== undefined) {
      Object.assign(myOrder, orderBy);
    } else {
      myOrder.id = 'asc';
    }

    const projectApplications =
      await this.prismaService.projectApplication.findMany({
        take: limit + 1,
        cursor: myCursor,
        skip: myCursor === undefined ? undefined : 1,
        where,
        orderBy: myOrder,
      });

    let nextCursor: string | undefined;
    if (projectApplications.at(limit) !== undefined) {
      nextCursor = projectApplications.at(limit - 1)?.id?.toString();
      projectApplications.pop();
    }

    return {
      cursor: nextCursor,
      data: projectApplications.map((projectMember) =>
        this.mapper.toEntity(projectMember),
      ),
    };
  }
}
