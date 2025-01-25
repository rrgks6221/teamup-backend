import { Module } from '@nestjs/common';

import { ProjectRecruitmentPostRepositoryModule } from '@module/project/repositories/project-recruitment-post.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { GetProjectRecruitmentPostController } from '@module/project/use-cases/get-project-recruitment-post/get-project-recruitment-post.controller';
import { GetProjectRecruitmentPostHandler } from '@module/project/use-cases/get-project-recruitment-post/get-project-recruitment-post.handler';

@Module({
  imports: [ProjectRepositoryModule, ProjectRecruitmentPostRepositoryModule],
  controllers: [GetProjectRecruitmentPostController],
  providers: [GetProjectRecruitmentPostHandler],
})
export class GetProjectRecruitmentPostModule {}
