import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';

import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import { AccountUpdatedEvent } from '@module/account/events/account-updated.event';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';

import { AWS_S3_PORT, AwsS3Port } from '@shared/services/aws-s3/aws-s3.port';

@EventsHandler(AccountUpdatedEvent)
export class AccountUpdatedHandler
  implements IEventHandler<AccountUpdatedEvent>
{
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepositoryPort,
    @Inject(AWS_S3_PORT) private readonly awsS3Adapter: AwsS3Port,
  ) {}

  @OnEvent(AccountUpdatedEvent.name)
  async handle(event: AccountUpdatedEvent) {
    const { eventPayload, aggregateId } = event;

    if (eventPayload.profileImagePath === undefined) {
      return;
    }

    const account = await this.accountRepository.findOneById(aggregateId);

    if (account === undefined) {
      throw new AccountNotFoundError();
    }

    const newProfileImagePath = `account/${aggregateId}/${eventPayload.profileImagePath.split('/').at(-1)}`;

    await this.awsS3Adapter.copyObject({
      copySource: eventPayload.profileImagePath,
      key: newProfileImagePath,
    });

    account.profileImagePath = newProfileImagePath;

    await this.accountRepository.update(account);
  }
}
