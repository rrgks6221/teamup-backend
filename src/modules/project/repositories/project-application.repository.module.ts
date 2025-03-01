import { Module } from '@nestjs/common';

import { ProjectApplicationRepository } from '@module/project/repositories/project-application.repository';
import { PROJECT_APPLICATION_REPOSITORY } from '@module/project/repositories/project-application.repository.port';

import { PrismaModule } from '@shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: PROJECT_APPLICATION_REPOSITORY,
      useClass: ProjectApplicationRepository,
    },
  ],
  exports: [PROJECT_APPLICATION_REPOSITORY],
})
export class ProjectApplicationRepositoryModule {}
