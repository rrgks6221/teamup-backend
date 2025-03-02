import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';

import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { ProjectMemberRole } from '@module/project/entities/project-member.entity';
import { ProjectMemberAlreadyExistsError } from '@module/project/errors/project-member-already-exists.error';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import { ProjectApplicationApprovedEvent } from '@module/project/events/project-application-approved.event';
import {
  PROJECT_MEMBER_REPOSITORY,
  ProjectMemberRepositoryPort,
} from '@module/project/repositories/project-member.repository.port';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

/**
 * @todo 메일 발송
 */
@EventsHandler(ProjectApplicationApprovedEvent)
export class ProjectApplicationApprovedHandler
  implements IEventHandler<ProjectApplicationApprovedEvent>
{
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepositoryPort,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositoryPort,
    @Inject(PROJECT_MEMBER_REPOSITORY)
    private readonly projectMemberRepository: ProjectMemberRepositoryPort,
    @Inject(EVENT_STORE) private readonly eventStore: IEventStore,
  ) {}

  @OnEvent(ProjectApplicationApprovedEvent.name)
  async handle(event: ProjectApplicationApprovedEvent) {
    const { eventPayload, aggregateId } = event;

    const [project, account, existingProjectMember] = await Promise.all([
      this.projectRepository.findOneById(aggregateId),
      this.accountRepository.findOneById(eventPayload.applicantId),
      this.projectMemberRepository.findOneByAccountInProject(
        aggregateId,
        eventPayload.applicantId,
      ),
    ]);

    if (project === undefined) {
      throw new ProjectNotFoundError();
    }

    if (account === undefined) {
      throw new AccountNotFoundError();
    }

    if (existingProjectMember !== undefined) {
      throw new ProjectMemberAlreadyExistsError();
    }

    const projectMember = project.createMember({
      accountId: eventPayload.applicantId,
      position: eventPayload.position,
      role: ProjectMemberRole.member,
      name: account.name,
      profileImagePath: account.profileImagePath,
      techStackNames: account.techStackNames,
    });

    await this.projectMemberRepository.insert(projectMember);

    await this.eventStore.storeAggregateEvents(project);
  }
}
