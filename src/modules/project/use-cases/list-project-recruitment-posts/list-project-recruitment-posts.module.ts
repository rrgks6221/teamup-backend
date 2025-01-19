import { Module } from '@nestjs/common';

import { ProjectRecruitmentPostRepositoryModule } from '@module/project/repositories/project-recruitment-post.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { ListProjectRecruitmentPostsController } from '@module/project/use-cases/list-project-recruitment-posts/list-project-recruitment-posts.controller';
import { ListProjectRecruitmentPostsHandler } from '@module/project/use-cases/list-project-recruitment-posts/list-project-recruitment-posts.handler';

@Module({
  imports: [ProjectRepositoryModule, ProjectRecruitmentPostRepositoryModule],
  controllers: [ListProjectRecruitmentPostsController],
  providers: [ListProjectRecruitmentPostsHandler],
})
export class ListProjectRecruitmentPostsModule {}
