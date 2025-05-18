import { Module } from '@nestjs/common';

import { ProjectApplicationRepositoryModule } from '@module/project/repositories/project-application.repository.module';
import { ProjectMemberRepositoryModule } from '@module/project/repositories/project-member.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { ListProjectApplicationsController } from '@module/project/use-cases/list-project-applications/list-project-applications.controller';
import { ListProjectApplicationsHandler } from '@module/project/use-cases/list-project-applications/list-project-applications.handler';

@Module({
  imports: [
    ProjectRepositoryModule,
    ProjectMemberRepositoryModule,
    ProjectApplicationRepositoryModule,
  ],
  controllers: [ListProjectApplicationsController],
  providers: [ListProjectApplicationsHandler],
})
export class ListProjectApplicationsModule {}
