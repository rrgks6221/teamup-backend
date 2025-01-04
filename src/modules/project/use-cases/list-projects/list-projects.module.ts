import { Module } from '@nestjs/common';

import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { ListProjectsController } from '@module/project/use-cases/list-projects/list-projects.controller';
import { ListProjectsHandler } from '@module/project/use-cases/list-projects/list-projects.handler';

@Module({
  imports: [ProjectRepositoryModule],
  controllers: [ListProjectsController],
  providers: [ListProjectsHandler],
})
export class ListProjectsModule {}
