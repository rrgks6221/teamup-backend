import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ProjectApplication } from '@module/project/entities/project-application.entity';
import { ProjectApplicationChangeStatusRestrictedError } from '@module/project/errors/project-application-change-status-restricted.error';
import { ProjectApplicationNotFoundError } from '@module/project/errors/project-application-not-found.error';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import {
  PROJECT_APPLICATION_REPOSITORY,
  ProjectApplicationRepositoryPort,
} from '@module/project/repositories/project-application.repository.port';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';
import { RejectProjectApplicationCommand } from '@module/project/use-cases/reject-project-application/reject-project-application.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(RejectProjectApplicationCommand)
export class RejectProjectApplicationHandler
  implements
    ICommandHandler<RejectProjectApplicationCommand, ProjectApplication>
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositoryPort,
    @Inject(PROJECT_APPLICATION_REPOSITORY)
    private readonly projectApplicationRepository: ProjectApplicationRepositoryPort,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  async execute(
    command: RejectProjectApplicationCommand,
  ): Promise<ProjectApplication> {
    const [project, application] = await Promise.all([
      this.projectRepository.findOneById(command.projectId),
      this.projectApplicationRepository.findOneById(command.applicationId),
    ]);

    if (project === undefined) {
      throw new ProjectNotFoundError();
    }

    if (application === undefined) {
      throw new ProjectApplicationNotFoundError();
    }

    if (project.ownerId !== command.currentUserId) {
      throw new ProjectApplicationChangeStatusRestrictedError(
        'Only project applicant can reject application status',
      );
    }

    project.rejectApplication(application);

    await this.projectApplicationRepository.update(application);

    await this.eventStore.storeAggregateEvents(project);

    return application;
  }
}
