import { Inject, Injectable } from '@nestjs/common';

import { Account } from '@module/account/entities/account.entity';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import {
  IUpdateAccountService,
  UpdateAccountCommand,
} from '@module/account/use-cases/update-account/update-account.service.interface';
import {
  IPositionService,
  POSITION_SERVICE,
} from '@module/position/services/position-service/position.service.interface';
import {
  ITechStackService,
  TECH_STACK_SERVICE,
} from '@module/tech-stack/services/tech-stack-service/tech-stack.service.interface';

@Injectable()
export class UpdateAccountService implements IUpdateAccountService {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepositoryPort,
    @Inject(POSITION_SERVICE)
    private readonly positionService: IPositionService,
    @Inject(TECH_STACK_SERVICE)
    private readonly techStackService: ITechStackService,
  ) {}

  async execute(command: UpdateAccountCommand): Promise<Account> {
    const account = await this.accountRepository.findOneById(command.accountId);

    if (account === undefined) {
      throw new AccountNotFoundError();
    }

    let positionNames: string[] | undefined;

    if (command.positionIds !== undefined) {
      const positions = await this.positionService.findByIdsOrFail(
        command.positionIds,
      );

      positionNames = positions.map((position) => position.name);
    }

    let techStackNames: string[] | undefined;

    if (command.techStackIds !== undefined) {
      const techStacks = await this.techStackService.findByIdsOrFail(
        command.techStackIds,
      );

      techStackNames = techStacks.map((techStack) => techStack.name);
    }

    account.update({ name: command.name, positionNames, techStackNames });

    await this.accountRepository.update(account);

    return account;
  }
}
