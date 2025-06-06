import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Account } from '@module/account/entities/account.entity';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { UpdateAccountCommand } from '@module/account/use-cases/update-account/update-account.command';
import {
  IPositionService,
  POSITION_SERVICE,
} from '@module/position/services/position-service/position.service.interface';
import {
  ITechStackService,
  TECH_STACK_SERVICE,
} from '@module/tech-stack/services/tech-stack-service/tech-stack.service.interface';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(UpdateAccountCommand)
export class UpdateAccountHandler
  implements ICommandHandler<UpdateAccountCommand, Account>
{
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepositoryPort,
    @Inject(POSITION_SERVICE)
    private readonly positionService: IPositionService,
    @Inject(TECH_STACK_SERVICE)
    private readonly techStackService: ITechStackService,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  async execute(command: UpdateAccountCommand): Promise<Account> {
    const account = await this.accountRepository.findOneById(command.accountId);

    if (account === undefined) {
      throw new AccountNotFoundError();
    }

    let positionNames: string[] | undefined;

    if (command.positionNames !== undefined) {
      const positions = await this.positionService.findByNamesOrFail(
        command.positionNames,
      );

      positionNames = positions.map((position) => position.name);
    }

    let techStackNames: string[] | undefined;

    if (command.techStackNames !== undefined) {
      const techStacks = await this.techStackService.findByNamesOrFail(
        command.techStackNames,
      );

      techStackNames = techStacks.map((techStack) => techStack.name);
    }

    /**
     * @todo 계정 업데이트 이벤트에 의한 계정의 temp 프로필 이미지를 복제
     */
    account.update({
      name: command.name,
      introduce: command.introduce,
      profileImagePath: command.profileImagePath,
      positionNames,
      techStackNames,
      snsLinks: command.snsLinks,
    });

    await this.accountRepository.update(account);

    await this.eventStore.storeAggregateEvents(account);

    return account;
  }
}
