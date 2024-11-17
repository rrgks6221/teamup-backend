import { Module } from '@nestjs/common';

import { AccountUpdatedHandler } from '@module/account/event-handlers/account-updated-event/account-updated.handler';
import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';

import { AwsS3Module } from '@shared/services/aws-s3/aws-s3.module';

@Module({
  imports: [AccountRepositoryModule, AwsS3Module],
  providers: [AccountUpdatedHandler],
})
export class AccountUpdatedModule {}
