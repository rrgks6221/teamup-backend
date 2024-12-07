import { Inject, Injectable } from '@nestjs/common';

import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import {
  DeleteAccountCommand,
  IDeleteAccountService,
} from '@module/account/use-cases/delete-account/delete-account.service.interface';

@Injectable()
export class DeleteAccountService implements IDeleteAccountService {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepositoryPort,
  ) {}

  async execute(command: DeleteAccountCommand): Promise<void> {
    const account = await this.accountRepository.findOneById(command.id);

    if (account === undefined) {
      throw new AccountNotFoundError();
    }

    await this.accountRepository.delete(account);
  }
}
