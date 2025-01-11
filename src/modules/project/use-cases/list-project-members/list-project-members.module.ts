import { Module } from '@nestjs/common';

import { ProjectMemberRepositoryModule } from '@module/project/repositories/project-member.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { ListProjectMembersController } from '@module/project/use-cases/list-project-members/list-project-members.controller';
import { ListProjectMembersHandler } from '@module/project/use-cases/list-project-members/list-project-members.handler';

@Module({
  imports: [ProjectRepositoryModule, ProjectMemberRepositoryModule],
  controllers: [ListProjectMembersController],
  providers: [ListProjectMembersHandler],
})
export class ListProjectMembersModule {}
