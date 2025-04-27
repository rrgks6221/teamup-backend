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
import { ApproveProjectInvitationCommand } from '@module/project/use-cases/approve-project-invitation/approve-project-invitation.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(ApproveProjectInvitationCommand)
export class ApproveProjectInvitationHandler
  implements
    ICommandHandler<ApproveProjectInvitationCommand, ProjectInvitation>
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
    command: ApproveProjectInvitationCommand,
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
        'Only project invitee can approve invitation status',
      );
    }

    project.approveInvitation(invitation);

    await this.projectInvitationRepository.update(invitation);

    await this.eventStore.storeAggregateEvents(project);

    return invitation;
  }
}
