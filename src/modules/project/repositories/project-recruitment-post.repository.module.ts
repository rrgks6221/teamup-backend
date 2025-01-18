import { Module } from '@nestjs/common';

import { ProjectRecruitmentPostRepository } from '@module/project/repositories/project-recruitment-post.repository';
import { PROJECT_RECRUITMENT_POST_REPOSITORY } from '@module/project/repositories/project-recruitment-post.repository.port';

import { PrismaModule } from '@shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: PROJECT_RECRUITMENT_POST_REPOSITORY,
      useClass: ProjectRecruitmentPostRepository,
    },
  ],
  exports: [PROJECT_RECRUITMENT_POST_REPOSITORY],
})
export class ProjectRecruitmentPostRepositoryModule {}
