import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Project } from '@module/project/entities/project.entity';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';
import { CreateProjectCommand } from '@module/project/use-cases/create-project/create-project.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler
  implements ICommandHandler<CreateProjectCommand, Project>
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositoryPort,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  async execute(command: CreateProjectCommand): Promise<Project> {
    const project = Project.create({
      ownerId: command.ownerId,
      name: command.name,
      description: command.description,
      category: command.category,
      tags: command.tags,
    });

    await this.projectRepository.insert(project);

    await this.eventStore.storeAggregateEvents(project);

    return project;
  }
}
