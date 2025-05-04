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
import { CancelProjectInvitationCommand } from '@module/project/use-cases/cancel-project-invitation/cancel-project-invitation.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(CancelProjectInvitationCommand)
export class CancelProjectInvitationHandler
  implements ICommandHandler<CancelProjectInvitationCommand, ProjectInvitation>
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
    command: CancelProjectInvitationCommand,
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

    if (invitation.inviterId !== command.currentUserId) {
      throw new ProjectInvitationChangeStatusRestrictedError(
        'Only project inviter can cancel invitation status',
      );
    }

    project.cancelInvitation(invitation);

    await this.projectInvitationRepository.update(invitation);

    await this.eventStore.storeAggregateEvents(project);

    return invitation;
  }
}
