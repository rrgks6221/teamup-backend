import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { ProjectMember } from '@module/project/entities/project-member.entity';
import { ProjectMemberAlreadyExistsError } from '@module/project/errors/project-member-already-exists.error';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import {
  PROJECT_MEMBER_REPOSITORY,
  ProjectMemberRepositoryPort,
} from '@module/project/repositories/project-member.repository.port';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';
import { CreateProjectMemberCommand } from '@module/project/use-cases/create-project-member/create-project-member.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(CreateProjectMemberCommand)
export class CreateProjectMemberHandler
  implements ICommandHandler<CreateProjectMemberCommand, ProjectMember>
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

  async execute(command: CreateProjectMemberCommand): Promise<ProjectMember> {
    const [project, account, existingProjectMember] = await Promise.all([
      this.projectRepository.findOneById(command.projectId),
      this.accountRepository.findOneById(command.accountId),
      this.projectMemberRepository.findOneByAccountInProject(
        command.projectId,
        command.accountId,
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
      accountId: command.accountId,
      position: command.position,
      role: command.role,
      name: account.name,
      profileImagePath: account.profileImagePath,
      techStackNames: account.techStackNames,
    });

    await this.projectMemberRepository.insert(projectMember);

    await this.eventStore.storeAggregateEvents(project);

    return projectMember;
  }
}
