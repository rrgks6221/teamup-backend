import { Module } from '@nestjs/common';

import { ProjectRepository } from '@module/project/repositories/project.repository';
import { PROJECT_REPOSITORY } from '@module/project/repositories/project.repository.port';

import { PrismaModule } from '@shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: PROJECT_REPOSITORY,
      useClass: ProjectRepository,
    },
  ],
  exports: [PROJECT_REPOSITORY],
})
export class ProjectRepositoryModule {}
