import { Module } from '@nestjs/common';

import { ProjectInvitationMarkAsCheckedHandler } from '@module/project/event-handlers/project-invitation-mark-as-checked-event/project-invitation-mark-as-checked.handler';

@Module({
  providers: [ProjectInvitationMarkAsCheckedHandler],
})
export class ProjectInvitationMarkAsCheckedModule {}
