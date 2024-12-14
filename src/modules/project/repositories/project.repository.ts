import { Inject, Injectable } from '@nestjs/common';

import { Project } from '@module/project/entities/project.entity';
import { ProjectMapper } from '@module/project/mappers/project.mapper';
import {
  ProjectFilter,
  ProjectRaw,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';

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

  findAllCursorPaginated(
    params: ICursorPaginatedParams<Project, ProjectFilter>,
  ): Promise<ICursorPaginated<Project>> {
    throw new Error('Method not implemented.');
  }
}
