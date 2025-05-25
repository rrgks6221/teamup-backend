import { Inject, Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { ProjectInvitation } from '@module/project/entities/project-invitation.entity';
import { ProjectInvitationMapper } from '@module/project/mappers/project-invitation.mapper';
import {
  ProjectInvitationFilter,
  ProjectInvitationOrder,
  ProjectInvitationRaw,
  ProjectInvitationRepositoryPort,
} from '@module/project/repositories/project-invitation.repository.port';

import {
  BaseRepository,
  ICursorPaginated,
  ICursorPaginatedParams,
} from '@common/base/base.repository';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class ProjectInvitationRepository
  extends BaseRepository<ProjectInvitation, ProjectInvitationRaw>
  implements ProjectInvitationRepositoryPort
{
  protected TABLE_NAME = 'projectInvitation';

  constructor(
    @Inject(PRISMA_SERVICE) protected readonly prismaService: PrismaService,
  ) {
    super(prismaService, ProjectInvitationMapper);
  }

  async findByProjectInvitee(
    projectId: string,
    inviteeId: string,
  ): Promise<ProjectInvitation[]> {
    if (isNaN(Number(projectId)) || isNaN(Number(inviteeId))) {
      return [];
    }

    const raws = await this.prismaService.projectInvitation.findMany({
      where: {
        projectId: this.mapper.toPrimaryKey(projectId),
        inviteeId: this.mapper.toPrimaryKey(inviteeId),
      },
      orderBy: {
        id: 'asc',
      },
    });

    return raws.map((raw) => this.mapper.toEntity(raw));
  }

  async findAllCursorPaginated(
    params: ICursorPaginatedParams<
      ProjectInvitationOrder,
      ProjectInvitationFilter
    >,
  ): Promise<ICursorPaginated<ProjectInvitation>> {
    const { limit = 20, cursor, orderBy, filter } = params;

    const myCursor =
      cursor === undefined
        ? undefined
        : {
            id: BigInt(cursor),
          };

    const where: Prisma.ProjectInvitationWhereInput = {};

    if (filter !== undefined) {
      if (filter.projectId !== undefined) {
        where.projectId = this.mapper.toPrimaryKey(filter.projectId);
      }
      if (filter.statuses !== undefined) {
        where.status = {
          in: Array.from(filter.statuses),
        };
      }
    }

    const myOrder: Prisma.ProjectInvitationOrderByWithRelationInput = {};

    if (orderBy !== undefined) {
      Object.assign(myOrder, orderBy);
    } else {
      myOrder.id = 'asc';
    }

    const projectInvitations =
      await this.prismaService.projectInvitation.findMany({
        take: limit + 1,
        cursor: myCursor,
        skip: myCursor === undefined ? undefined : 1,
        where,
        orderBy: myOrder,
      });

    let nextCursor: string | undefined;
    if (projectInvitations.at(limit) !== undefined) {
      nextCursor = projectInvitations.at(limit - 1)?.id?.toString();
      projectInvitations.pop();
    }

    return {
      cursor: nextCursor,
      data: projectInvitations.map((projectMember) =>
        this.mapper.toEntity(projectMember),
      ),
    };
  }
}
