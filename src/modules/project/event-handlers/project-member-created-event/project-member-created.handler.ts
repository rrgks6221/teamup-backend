import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';

import { ProjectMemberCreatedEvent } from '@module/project/events/project-member-created.event';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';

@EventsHandler(ProjectMemberCreatedEvent)
export class ProjectMemberCreatedHandler
  implements IEventHandler<ProjectMemberCreatedEvent>
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositoryPort,
  ) {}

  @OnEvent(ProjectMemberCreatedEvent.name)
  async handle(event: ProjectMemberCreatedEvent) {
    const { aggregateId } = event;

    await this.projectRepository.incrementMemberCount(aggregateId);
  }
}
