import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import { AccountUpdatedHandler } from '@module/account/event-handlers/account-updated-event/account-updated.handler';
import { AccountUpdatedEvent } from '@module/account/events/account-updated.event';
import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';

import { AppConfigModule } from '@common/app-config/app-config.module';
import { generateEntityId } from '@common/base/base.entity';

import { AwsS3Module } from '@shared/services/aws-s3/aws-s3.module';
import { AWS_S3_PORT, AwsS3Port } from '@shared/services/aws-s3/aws-s3.port';

describe(AccountUpdatedHandler.name, () => {
  let handler: AccountUpdatedHandler;

  let accountRepository: AccountRepositoryPort;
  let awsS3Adapter: AwsS3Port;

  let event: AccountUpdatedEvent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AccountRepositoryModule, AwsS3Module, AppConfigModule],
      providers: [AccountUpdatedHandler],
    }).compile();

    handler = module.get<AccountUpdatedHandler>(AccountUpdatedHandler);

    accountRepository = module.get<AccountRepositoryPort>(ACCOUNT_REPOSITORY);
    awsS3Adapter = module.get<AwsS3Port>(AWS_S3_PORT);
  });

  beforeEach(() => {
    event = new AccountUpdatedEvent(generateEntityId(), {
      profileImagePath: faker.string.nanoid(),
    });

    jest.spyOn(accountRepository, 'update');
    jest.spyOn(awsS3Adapter, 'copyObject').mockResolvedValue(undefined);
  });

  describe('계정이 존재하고', () => {
    beforeEach(async () => {
      await accountRepository.insert(
        AccountFactory.build({ id: event.aggregateId }),
      );
    });

    describe('계정의 정보가 변경되면', () => {
      it('계정의 프로필 이미지를 변경해야한다.', async () => {
        await expect(handler.handle(event)).resolves.toBeUndefined();
        expect(accountRepository.update).toHaveBeenCalled();
      });
    });
  });

  describe('계정이 존재하지 않는 경우', () => {
    describe('계정의 정보가 변경되면', () => {
      it('계정이 존재하지 않는다는 에러가 발생해야한다.', async () => {
        await expect(handler.handle(event)).rejects.toThrow(
          AccountNotFoundError,
        );
      });
    });
  });
});
