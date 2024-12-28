import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ProjectMemberDeletionRestrictedError } from '@module/project/errors/project-member-deletion-restricted.error';
import { ProjectMemberNotFoundError } from '@module/project/errors/project-member-not-found.error copy';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import {
  PROJECT_MEMBER_REPOSITORY,
  ProjectMemberRepositoryPort,
} from '@module/project/repositories/project-member.repository.port';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';
import { RemoveProjectMemberCommand } from '@module/project/use-cases/remove-project-member/remove-project-member.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(RemoveProjectMemberCommand)
export class RemoveProjectMemberHandler
  implements ICommandHandler<RemoveProjectMemberCommand, void>
{
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositoryPort,
    @Inject(PROJECT_MEMBER_REPOSITORY)
    private readonly projectMemberRepository: ProjectMemberRepositoryPort,
    @Inject(EVENT_STORE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: RemoveProjectMemberCommand): Promise<void> {
    const [project, projectMember] = await Promise.all([
      this.projectRepository.findOneById(command.projectId),
      this.projectMemberRepository.findOneById(command.memberId),
    ]);

    if (project === undefined) {
      throw new ProjectNotFoundError();
    }

    if (projectMember === undefined) {
      throw new ProjectMemberNotFoundError();
    }

    const isProjectOwner = project.ownerId === command.currentUserId;
    const isMe = command.currentUserId === command.memberId;

    if (isProjectOwner === false && isMe === false) {
      throw new ProjectMemberDeletionRestrictedError(
        'Can leave only self or project owner',
      );
    }

    project.removeMember(projectMember);

    await this.projectMemberRepository.delete(projectMember);

    await this.eventStore.storeAggregateEvents(project);
  }
}
