import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';

import { ProjectMemberRemovedEvent } from '@module/project/events/project-member-removed.event';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';

@EventsHandler(ProjectMemberRemovedEvent)
export class ProjectMemberRemovedHandler
  implements IEventHandler<ProjectMemberRemovedEvent>
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositoryPort,
  ) {}

  @OnEvent(ProjectMemberRemovedEvent.name)
  async handle(event: ProjectMemberRemovedEvent) {
    const { aggregateId } = event;

    await this.projectRepository.decrementMemberCount(aggregateId);
  }
}
