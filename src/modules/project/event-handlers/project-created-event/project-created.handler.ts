import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';

import {
  ProjectMember,
  ProjectMemberRole,
} from '@module/project/entities/project-member.entity';
import { ProjectCreatedEvent } from '@module/project/events/project-created.event';
import { CreateProjectMemberCommand } from '@module/project/use-cases/create-project-member/create-project-member.command';

@EventsHandler(ProjectCreatedEvent)
export class ProjectCreatedHandler
  implements IEventHandler<ProjectCreatedEvent>
{
  constructor(private readonly commandBud: CommandBus) {}

  @OnEvent(ProjectCreatedEvent.name)
  async handle(event: ProjectCreatedEvent) {
    const { eventPayload, aggregateId } = event;

    const command = new CreateProjectMemberCommand({
      accountId: eventPayload.ownerId,
      projectId: aggregateId,
      positionName: undefined,
      role: ProjectMemberRole.owner,
    });

    await this.commandBud.execute<CreateProjectMemberCommand, ProjectMember>(
      command,
    );
  }
}
