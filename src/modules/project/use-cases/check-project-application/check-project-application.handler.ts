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
  PROJECT_MEMBER_REPOSITORY,
  ProjectMemberRepositoryPort,
} from '@module/project/repositories/project-member.repository.port';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';
import { CheckProjectApplicationCommand } from '@module/project/use-cases/check-project-application/check-project-application.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(CheckProjectApplicationCommand)
export class CheckProjectApplicationHandler
  implements
    ICommandHandler<CheckProjectApplicationCommand, ProjectApplication>
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositoryPort,
    @Inject(PROJECT_MEMBER_REPOSITORY)
    private readonly projectMemberRepository: ProjectMemberRepositoryPort,
    @Inject(PROJECT_APPLICATION_REPOSITORY)
    private readonly projectApplicationRepository: ProjectApplicationRepositoryPort,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  async execute(
    command: CheckProjectApplicationCommand,
  ): Promise<ProjectApplication> {
    const [project, application, currentMember] = await Promise.all([
      this.projectRepository.findOneById(command.projectId),
      this.projectApplicationRepository.findOneById(command.applicationId),
      this.projectMemberRepository.findOneByAccountInProject(
        command.projectId,
        command.currentUserId,
      ),
    ]);

    if (project === undefined) {
      throw new ProjectNotFoundError();
    }

    if (application === undefined) {
      throw new ProjectApplicationNotFoundError();
    }

    if (currentMember === undefined || currentMember.isManager() === false) {
      throw new ProjectApplicationChangeStatusRestrictedError(
        'Only project manager can approve application status',
      );
    }

    project.markApplicationAsChecked(application);

    await this.projectApplicationRepository.update(application);

    await this.eventStore.storeAggregateEvents(project);

    return application;
  }
}
