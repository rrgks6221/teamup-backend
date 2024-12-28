import { Module } from '@nestjs/common';

import { ProjectMemberRemovedHandler } from '@module/project/event-handlers/project-member-removed-event/project-member-removed.handler';
import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';

@Module({
  imports: [ProjectRepositoryModule],
  providers: [ProjectMemberRemovedHandler],
})
export class ProjectMemberRemovedModule {}
