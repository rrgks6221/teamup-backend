import { Inject, Injectable } from '@nestjs/common';

import { ProjectRecruitmentPost } from '@module/project/entities/project-recruitment-post.entity';
import { ProjectRecruitmentPostMapper } from '@module/project/mappers/project-recruitment-post.mapper';
import {
  ProjectRecruitmentPostRaw,
  ProjectRecruitmentPostRepositoryPort,
} from '@module/project/repositories/project-recruitment-post.repository.port';

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

  findAllCursorPaginated(
    params: ICursorPaginatedParams,
  ): Promise<ICursorPaginated<ProjectRecruitmentPost>> {
    throw new Error('Method not implemented.');
  }
}
