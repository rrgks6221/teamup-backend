import { Inject, Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { ProjectMember } from '@module/project/entities/project-member.entity';
import { ProjectMemberMapper } from '@module/project/mappers/project-member.mapper';
import {
  ProjectMemberFilter,
  ProjectMemberOrder,
  ProjectMemberRaw,
  ProjectMemberRepositoryPort,
} from '@module/project/repositories/project-member.repository.port';

import { EntityId } from '@common/base/base.entity';
import {
  BaseRepository,
  ICursorPaginated,
  ICursorPaginatedParams,
} from '@common/base/base.repository';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class ProjectMemberRepository
  extends BaseRepository<ProjectMember, ProjectMemberRaw>
  implements ProjectMemberRepositoryPort
{
  protected TABLE_NAME = 'projectMember';

  constructor(
    @Inject(PRISMA_SERVICE) protected readonly prismaService: PrismaService,
  ) {
    super(prismaService, ProjectMemberMapper);
  }

  async findOneByAccountInProject(
    projectId: EntityId,
    accountId: EntityId,
  ): Promise<ProjectMember | undefined> {
    if (isNaN(Number(projectId)) || isNaN(Number(accountId))) {
      return;
    }

    const raw = await this.prismaService.projectMember.findUnique({
      where: {
        accountId_projectId: {
          projectId: this.mapper.toPrimaryKey(projectId),
          accountId: this.mapper.toPrimaryKey(accountId),
        },
      },
    });

    if (raw === null) {
      return;
    }

    return this.mapper.toEntity(raw);
  }

  async findAllCursorPaginated(
    params: ICursorPaginatedParams<ProjectMemberOrder, ProjectMemberFilter>,
  ): Promise<ICursorPaginated<ProjectMember>> {
    const { limit = 20, cursor, orderBy, filter = {} } = params;

    const myCursor =
      cursor === undefined
        ? undefined
        : {
            id: BigInt(cursor),
          };

    const where: Prisma.ProjectMemberWhereInput = {};

    if (filter.projectId !== undefined) {
      where.projectId = this.mapper.toPrimaryKey(filter.projectId);
    }

    const myOrder: Prisma.ProjectMemberOrderByWithRelationInput = {};

    if (orderBy !== undefined) {
      Object.assign(myOrder, orderBy);
    } else {
      myOrder.id = 'asc';
    }

    const projectMembers = await this.prismaService.projectMember.findMany({
      take: limit + 1,
      cursor: myCursor,
      skip: myCursor === undefined ? undefined : 1,
      where,
      orderBy: myOrder,
    });

    let nextCursor: string | undefined;
    if (projectMembers.at(limit) !== undefined) {
      nextCursor = projectMembers.at(limit - 1)?.id?.toString();
      projectMembers.pop();
    }

    return {
      cursor: nextCursor,
      data: projectMembers.map((projectMember) =>
        this.mapper.toEntity(projectMember),
      ),
    };
  }
}
