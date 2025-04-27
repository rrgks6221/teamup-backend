import { Module } from '@nestjs/common';

import { ProjectInvitationApprovedHandler } from '@module/project/event-handlers/project-invitation-approved-event/project-invitation-approved.handler';

@Module({
  providers: [ProjectInvitationApprovedHandler],
})
export class ProjectInvitationApprovedModule {}
