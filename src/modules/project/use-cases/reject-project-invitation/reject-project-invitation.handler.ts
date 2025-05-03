import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ProjectInvitation } from '@module/project/entities/project-invitation.entity';
import { ProjectInvitationChangeStatusRestrictedError } from '@module/project/errors/project-invitation-change-status-restricted.error';
import { ProjectInvitationNotFoundError } from '@module/project/errors/project-invitation-not-found.error';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import {
  PROJECT_INVITATION_REPOSITORY,
  ProjectInvitationRepositoryPort,
} from '@module/project/repositories/project-invitation.repository.port';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';
import { RejectProjectInvitationCommand } from '@module/project/use-cases/reject-project-invitation/reject-project-invitation.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(RejectProjectInvitationCommand)
export class RejectProjectInvitationHandler
  implements ICommandHandler<RejectProjectInvitationCommand, ProjectInvitation>
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositoryPort,
    @Inject(PROJECT_INVITATION_REPOSITORY)
    private readonly projectInvitationRepository: ProjectInvitationRepositoryPort,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  async execute(
    command: RejectProjectInvitationCommand,
  ): Promise<ProjectInvitation> {
    const [project, invitation] = await Promise.all([
      this.projectRepository.findOneById(command.projectId),
      this.projectInvitationRepository.findOneById(command.invitationId),
    ]);

    if (project === undefined) {
      throw new ProjectNotFoundError();
    }

    if (invitation === undefined) {
      throw new ProjectInvitationNotFoundError();
    }

    if (invitation.inviteeId !== command.currentUserId) {
      throw new ProjectInvitationChangeStatusRestrictedError(
        'Only project invitee can reject invitation status',
      );
    }

    project.rejectInvitation(invitation);

    await this.projectInvitationRepository.update(invitation);

    await this.eventStore.storeAggregateEvents(project);

    return invitation;
  }
}
