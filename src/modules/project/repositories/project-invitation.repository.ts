import { Inject, Injectable } from '@nestjs/common';

import { ProjectInvitation } from '@module/project/entities/project-invitation.entity';
import { ProjectInvitationMapper } from '@module/project/mappers/project-invitation.mapper';
import {
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

  findAllCursorPaginated(
    params: ICursorPaginatedParams,
  ): Promise<ICursorPaginated<ProjectInvitation>> {
    throw new Error('Method not implemented.');
  }
}
