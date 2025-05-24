import { Module } from '@nestjs/common';

import { ProjectApplicationRepositoryModule } from '@module/project/repositories/project-application.repository.module';
import { ProjectMemberRepositoryModule } from '@module/project/repositories/project-member.repository.module';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { GetProjectApplicationController } from '@module/project/use-cases/get-project-application/get-project-application.controller';
import { GetProjectApplicationHandler } from '@module/project/use-cases/get-project-application/get-project-application.handler';

@Module({
  imports: [
    ProjectRepositoryModule,
    ProjectMemberRepositoryModule,
    ProjectApplicationRepositoryModule,
  ],
  controllers: [GetProjectApplicationController],
  providers: [GetProjectApplicationHandler],
})
export class GetProjectApplicationModule {}
