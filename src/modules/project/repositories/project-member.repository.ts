import { Inject, Injectable } from '@nestjs/common';

import { ProjectMember } from '@module/project/entities/project-member.entity';
import { ProjectMemberMapper } from '@module/project/mappers/project-member.mapper';
import {
  ProjectMemberFilter,
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

  findAllCursorPaginated(
    params: ICursorPaginatedParams<ProjectMember, ProjectMemberFilter>,
  ): Promise<ICursorPaginated<ProjectMember>> {
    throw new Error('Method not implemented.');
  }
}
