import { Module } from '@nestjs/common';

import { ProjectRecruitmentPostRepositoryModule } from '@module/project/repositories/project-recruitment-post.repository.module';
import { IncrementRecruitmentPostViewCountController } from '@module/project/use-cases/increment-recruitment-post-view-count/increment-recruitment-post-view-count.controller';
import { IncrementRecruitmentPostViewCountHandler } from '@module/project/use-cases/increment-recruitment-post-view-count/increment-recruitment-post-view-count.handler';

@Module({
  imports: [ProjectRecruitmentPostRepositoryModule],
  controllers: [IncrementRecruitmentPostViewCountController],
  providers: [IncrementRecruitmentPostViewCountHandler],
})
export class IncrementRecruitmentPostViewCountModule {}
