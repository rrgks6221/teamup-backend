import { Module } from '@nestjs/common';

import { AccountRepository } from '@module/account/repositories/account/account.repository';
import { ACCOUNT_REPOSITORY } from '@module/account/repositories/account/account.repository.port';

import { PrismaModule } from '@shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: ACCOUNT_REPOSITORY,
      useClass: AccountRepository,
    },
  ],
  exports: [ACCOUNT_REPOSITORY],
})
export class AccountRepositoryModule {}
