import { Module } from '@nestjs/common';

import { ProjectInvitationRepository } from '@module/project/repositories/project-invitation.repository';
import { PROJECT_INVITATION_REPOSITORY } from '@module/project/repositories/project-invitation.repository.port';

import { PrismaModule } from '@shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: PROJECT_INVITATION_REPOSITORY,
      useClass: ProjectInvitationRepository,
    },
  ],
  exports: [PROJECT_INVITATION_REPOSITORY],
})
export class ProjectInvitationRepositoryModule {}
