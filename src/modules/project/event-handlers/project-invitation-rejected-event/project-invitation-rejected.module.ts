import { Module } from '@nestjs/common';

import { ProjectInvitationRejectedHandler } from '@module/project/event-handlers/project-invitation-rejected-event/project-invitation-rejected.handler';

@Module({
  providers: [ProjectInvitationRejectedHandler],
})
export class ProjectInvitationRejectedModule {}
