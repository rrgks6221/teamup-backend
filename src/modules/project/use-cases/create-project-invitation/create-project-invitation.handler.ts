import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import {
  IPositionService,
  POSITION_SERVICE,
} from '@module/position/services/position-service/position.service.interface';
import { ProjectInvitation } from '@module/project/entities/project-invitation.entity';
import { ProjectMemberAlreadyExistsError } from '@module/project/errors/project-member-already-exists.error';
import { ProjectNotFoundError } from '@module/project/errors/project-not-found.error';
import {
  PROJECT_INVITATION_REPOSITORY,
  ProjectInvitationRepositoryPort,
} from '@module/project/repositories/project-invitation.repository.port';
import {
  PROJECT_MEMBER_REPOSITORY,
  ProjectMemberRepositoryPort,
} from '@module/project/repositories/project-member.repository.port';
import {
  PROJECT_REPOSITORY,
  ProjectRepositoryPort,
} from '@module/project/repositories/project.repository.port';
import { CreateProjectInvitationCommand } from '@module/project/use-cases/create-project-invitation/create-project-invitation.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(CreateProjectInvitationCommand)
export class CreateProjectInvitationHandler
  implements ICommandHandler<CreateProjectInvitationCommand, ProjectInvitation>
{
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepositoryPort,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositoryPort,
    @Inject(PROJECT_MEMBER_REPOSITORY)
    private readonly projectMemberRepository: ProjectMemberRepositoryPort,
    @Inject(PROJECT_INVITATION_REPOSITORY)
    private readonly projectInvitationRepository: ProjectInvitationRepositoryPort,
    @Inject(POSITION_SERVICE)
    private readonly positionService: IPositionService,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  async execute(
    command: CreateProjectInvitationCommand,
  ): Promise<ProjectInvitation> {
    const [inviteeAccount, project, member] = await Promise.all([
      this.accountRepository.findOneById(command.inviteeId),
      this.projectRepository.findOneById(command.projectId),
      this.projectMemberRepository.findOneByAccountInProject(
        command.projectId,
        command.inviteeId,
      ),
    ]);

    if (inviteeAccount === undefined) {
      throw new AccountNotFoundError('Invitee account not found');
    }

    if (project === undefined) {
      throw new ProjectNotFoundError();
    }

    if (member !== undefined) {
      throw new ProjectMemberAlreadyExistsError();
    }

    const [position] = await this.positionService.findByNamesOrFail([
      command.positionName,
    ]);

    project.invitations =
      await this.projectInvitationRepository.findByProjectInvitee(
        command.projectId,
        command.inviteeId,
      );

    const projectInvitation = project.createInvitation({
      inviteeId: command.inviteeId,
      inviterId: command.inviterId,
      positionName: position.name,
    });

    await this.projectInvitationRepository.insert(projectInvitation);

    await this.eventStore.storeAggregateEvents(project);

    return projectInvitation;
  }
}
