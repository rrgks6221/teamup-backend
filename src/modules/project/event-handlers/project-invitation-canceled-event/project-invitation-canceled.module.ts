import { Module } from '@nestjs/common';

import { ProjectInvitationCanceledHandler } from '@module/project/event-handlers/project-invitation-canceled-event/project-invitation-canceled.handler';

@Module({
  providers: [ProjectInvitationCanceledHandler],
})
export class ProjectInvitationCanceledModule {}
