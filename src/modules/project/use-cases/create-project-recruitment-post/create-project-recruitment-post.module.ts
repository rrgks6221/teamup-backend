import { Module } from '@nestjs/common';

import { PositionServiceModule } from '@module/position/services/position-service/position-service.module';
import { ProjectMemberRepositoryModule } from '@module/project/repositories/project-member.repository.module';
import { ProjectRecruitmentPostRepositoryModule } from '@module/project/repositories/project-recruitment-post.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { CreateProjectRecruitmentPostController } from '@module/project/use-cases/create-project-recruitment-post/create-project-recruitment-post.controller';
import { CreateProjectRecruitmentPostHandler } from '@module/project/use-cases/create-project-recruitment-post/create-project-recruitment-post.handler';
import { TechStackServiceModule } from '@module/tech-stack/services/tech-stack-service/tech-stack-service.module';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    ProjectRepositoryModule,
    ProjectMemberRepositoryModule,
    ProjectRecruitmentPostRepositoryModule,
    PositionServiceModule,
    TechStackServiceModule,
    EventStoreModule,
  ],
  controllers: [CreateProjectRecruitmentPostController],
  providers: [CreateProjectRecruitmentPostHandler],
})
export class CreateProjectRecruitmentPostModule {}
