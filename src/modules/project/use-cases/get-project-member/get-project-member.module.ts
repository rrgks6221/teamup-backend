import { Module } from '@nestjs/common';

import { ProjectMemberRepositoryModule } from '@module/project/repositories/project-member.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { GetProjectMemberController } from '@module/project/use-cases/get-project-member/get-project-member.controller';
import { GetProjectMemberHandler } from '@module/project/use-cases/get-project-member/get-project-member.handler';

@Module({
  imports: [ProjectRepositoryModule, ProjectMemberRepositoryModule],
  controllers: [GetProjectMemberController],
  providers: [GetProjectMemberHandler],
})
export class GetProjectMemberModule {}
