import { Inject, Injectable } from '@nestjs/common';

import { ProjectApplication } from '@module/project/entities/project-application.entity';
import { ProjectApplicationMapper } from '@module/project/mappers/project-application.mapper';
import {
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

  findAllCursorPaginated(
    params: ICursorPaginatedParams,
  ): Promise<ICursorPaginated<ProjectApplication>> {
    throw new Error('Method not implemented.');
  }
}
