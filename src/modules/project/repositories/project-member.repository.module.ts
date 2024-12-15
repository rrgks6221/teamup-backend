import { Module } from '@nestjs/common';

import { ProjectMemberRepository } from '@module/project/repositories/project-member.repository';
import { PROJECT_MEMBER_REPOSITORY } from '@module/project/repositories/project-member.repository.port';

import { PrismaModule } from '@shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: PROJECT_MEMBER_REPOSITORY,
      useClass: ProjectMemberRepository,
    },
  ],
  exports: [PROJECT_MEMBER_REPOSITORY],
})
export class ProjectMemberRepositoryModule {}
