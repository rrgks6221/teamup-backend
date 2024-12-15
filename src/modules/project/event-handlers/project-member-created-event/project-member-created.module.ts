import { Module } from '@nestjs/common';

import { ProjectMemberCreatedHandler } from '@module/project/event-handlers/project-member-created-event/project-member-created.handler';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';

@Module({
  imports: [ProjectRepositoryModule],
  providers: [ProjectMemberCreatedHandler],
})
export class ProjectMemberCreatedModule {}
